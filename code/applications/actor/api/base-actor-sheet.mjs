import BlackFlagActiveEffect from "../../../documents/active-effect.mjs";
import { formatWeight } from "../../../utils/_module.mjs";
import ApplicationV2Mixin from "../../api/mixin.mjs";
import PrimarySheetMixin from "../../api/primary-sheet-mixin.mjs";
import EffectsElement from "../../components/effects.mjs";
import InventoryElement from "../../components/inventory.mjs";
import NotificationTooltip from "../../notification-tooltip.mjs";
import AbilityConfig from "../config/ability-config.mjs";
import ArmorClassConfig from "../config/armor-class-config.mjs";
import HealthConfig from "../config/health-config.mjs";
import InitiativeConfig from "../config/initiative-config.mjs";
import LanguageConfig from "../config/language-config.mjs";
import LuckConfig from "../config/luck-config.mjs";
import MovementConfig from "../config/movement-config.mjs";
import ProficiencyConfig from "../config/proficiency-config.mjs";
import ResistanceConfig from "../config/resistance-config.mjs";
import SensesConfig from "../config/senses-config.mjs";
import SkillConfig from "../config/skill-config.mjs";
import ToolConfig from "../config/tool-config.mjs";
import TypeConfig from "../config/type-config.mjs";

/**
 * Sheet class containing implementation shared across all actor types.
 */
export default class BaseActorSheet extends PrimarySheetMixin(
	ApplicationV2Mixin(foundry.applications.sheets.ActorSheetV2)
) {
	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			rest: BaseActorSheet.#rest,
			roll: BaseActorSheet.#roll,
			showArtwork: BaseActorSheet.#showArtwork,
			showConfiguration: BaseActorSheet.#showConfiguration
		},
		classes: ["actor", "standard-form"],
		form: {
			submitOnChange: true
		},
		window: {
			resizable: true
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Fields that will be enriched during data preparation.
	 * @type {object}
	 */
	static enrichedFields = {};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*             Properties              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Filters that can be applied to different item lists.
	 * @type {Record<string, Record<string, number>>}
	 */
	filters = {};

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Sorting mode applied to different item lists.
	 * @type {Record<string, string>}
	 */
	sorting = {};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareContext(options) {
		const context = {
			...(await super._prepareContext(options)),
			actor: this.actor,
			fields: this.actor.system.schema.fields,
			system: this.actor.system,
			user: game.user
		};
		context.source = context.editable ? this.actor.system._source : this.actor.system;

		await this._prepareActions(context);
		await this._prepareItems(context);
		await this._prepareTraits(context);

		// 		context.appID = this.id;

		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare rendering context for the effects tab.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @param {HandlebarsRenderOptions} options - Options which configure application rendering behavior.
	 * @returns {ApplicationRenderContext}
	 * @protected
	 */
	async _prepareEffectsContext(context, options) {
		context.effects = EffectsElement.prepareActorContext(this.document.allApplicableEffects());
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare rendering context for the header.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @param {HandlebarsRenderOptions} options - Options which configure application rendering behavior.
	 * @returns {ApplicationRenderContext}
	 * @protected
	 */
	async _prepareHeaderContext(context, options) {
		context.name = {
			value: this.actor.name,
			editable: this.actor._source.name,
			field: this.actor.schema.getField("name")
		};
		context.img = {
			value: this.actor.img,
			editable: this.actor._source.img
		};

		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare rendering context for the tabs.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @param {HandlebarsRenderOptions} options - Options which configure application rendering behavior.
	 * @returns {Promise<ApplicationRenderContext>}
	 * @protected
	 */
	async _prepareTabsContext(context, options) {
		context.tabs = foundry.utils.deepClone(this.constructor.TABS);
		const activeTab = context.tabs.find(t => t.tab === this.tabGroups.primary) ?? context.tabs[0];
		activeTab.active = true;
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*      Actor Preparation Helpers      */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare actions for display.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @protected
	 */
	async _prepareActions(context) {
		context.actions = Object.entries(CONFIG.BlackFlag.actionTypes.localized).reduce((obj, [key, label]) => {
			obj[key] = { label, activities: [] };
			return obj;
		}, {});
		context.actions.other = { label: game.i18n.localize("BF.ACTIVATION.Type.Other"), activities: [] };
		for (const item of this.actor.items) {
			if (!item.system.displayActions) continue;
			for (const activity of item.system.actions?.() ?? []) {
				if (!activity.displayAction) continue;
				const data = {
					activity,
					item: activity.item,
					label: activity.activationLabel,
					activationTooltip: activity.activation.condition,
					usesColumn: activity.usesColumn,
					challengeColumn: activity.challengeColumn,
					effectColumn: activity.effectColumn
				};
				if (activity.actionType in context.actions) context.actions[activity.actionType].activities.push(data);
				else context.actions.other.activities.push(data);
			}
		}
		await this._prepareSpecialActions(context.actions);
		for (const [key, value] of Object.entries(context.actions)) {
			if (!value.activities.length) delete context.actions[key];
			else
				context.actions[key].activities.sort((lhs, rhs) => (lhs.item?.sort ?? Infinity) - (rhs.item?.sort ?? Infinity));
		}
		// TODO: Figure out how these should be sorted
	}

	/**
	 * Prepare any additional actions not covered by activities.
	 * @param {Record<string, {label: string, actions: object[]}>} actions - Action sections already prepared.
	 */
	async _prepareSpecialActions(actions) {}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare enriched descriptions.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @returns {object}
	 * @protected
	 */
	async _prepareDescriptions(context) {
		const enrichmentContext = {
			relativeTo: this.actor,
			rollData: this.actor.getRollData(),
			secrets: this.actor.isOwner
		};
		const enriched = {};
		for (const [key, path] of Object.entries(this.constructor.enrichedFields)) {
			enriched[key] = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
				foundry.utils.getProperty(context, path),
				enrichmentContext
			);
		}
		return enriched;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare items display across the sheet.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @protected
	 */
	async _prepareItems(context) {
		context.itemContext ??= {};
		context.sections = await InventoryElement.organizeItems(this.actor, this.actor.items, {
			callback: async (item, section) => {
				const itemContext = (context.itemContext[item.id] ??= {});
				await this._prepareItem(item, itemContext, section);
			},
			hide: !context.editable
		});
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare actor portrait for display.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @returns {object}
	 * @protected
	 */
	_preparePortrait(context) {
		const showTokenPortrait = false;
		const token = this.actor.isToken ? this.actor.token : this.actor.prototypeToken;
		const defaultArtwork = Actor.implementation.getDefaultArtwork(this.actor._source)?.img;
		return {
			path: showTokenPortrait ? (this.actor.isToken ? "" : "prototypeToken.texture.src") : "img",
			showBoth: context.editable || this.actor.img !== token.texture.src,
			src: showTokenPortrait ? token.texture.src : this.actor.img ?? defaultArtwork,
			token: showTokenPortrait
		};
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare various traits that might be displayed on the actor's sheet.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @protected
	 */
	async _prepareTraits(context) {}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*       Item Preparation Helpers      */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare activity context within the inventory list.
	 * @param {Activity} activity - Activity to prepare.
	 * @returns {object}
	 * @protected
	 */
	_prepareActivity(activity) {
		return activity.listContext;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare context data for a specific item.
	 * @param {BlackFlagItem} item - Item being prepared.
	 * @param {object} context - Context object for this item.
	 * @param {object} section - Sheet section within which this item will be displayed.
	 * @protected
	 */
	async _prepareItem(item, context, section) {
		context.activities = item.system.activities?.map(a => this._prepareActivity(a));

		context.buttons ??= [];
		context.dataset ??= {};
		if ((item.system.activities?.size || item.transferredEffects.length) && section.tab === "features")
			context.buttons.push({
				action: "enable",
				classes: "status",
				disabled: !item.isOwner,
				label: "BF.Feature.Enabled",
				pressed: item.enabled,
				title: `BF.Feature.${item.enabled ? "Enabled" : "Disabled"}`,
				icon: `<i class="fa-regular ${item.enabled ? "fa-square-check" : "fa-square"}"></i>`
			});

		if (this.expandedSections.get(item.id)) {
			context.expanded = await item.getSummaryContext({ secrets: this.actor.isOwner });
		}

		context.canDelete = section.options?.canDelete !== false;
		context.canDuplicate = section.options?.canDuplicate !== false;

		const totalWeight = await item.system.totalWeight;
		context.weight = totalWeight
			? formatWeight(totalWeight.toNearest(0.1), item.system.weight.units, { unitDisplay: "short" })
			: "—";
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Life-Cycle Handlers         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Add tooltips to inventory items.
	 * @param {HTMLElement} element - The element to get a tooltip.
	 * @protected
	 */
	_applyItemTooltip(element) {
		if ("tooltip" in element.dataset) return;

		const target = element.closest("[data-item-id], [data-effect-id], [data-uuid]");
		let { uuid, effectId, itemId, parentId } = target?.dataset ?? {};
		if (!uuid && itemId) uuid = this.actor.items.get(itemId)?.uuid;
		else if (!uuid && effectId) {
			const collection = parentId ? this.actor.items.get(parentId)?.effects : this.actor.effects;
			uuid = collection.get(effectId)?.uuid;
		}
		if (!uuid) return;

		element.dataset.tooltip = `<section class="loading" data-uuid="${uuid}"></section>`;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_onFirstRender(context, options) {
		super._onFirstRender(context, options);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _onRender(context, options) {
		await super._onRender(context, options);

		NotificationTooltip.activateListeners(this.actor, this.element);

		for (const element of this.element.querySelectorAll(".item-tooltip")) this._applyItemTooltip(element);

		// Hit Points
		for (const element of this.element.querySelectorAll('[name$=".hp.value"]')) {
			element.addEventListener("change", this._onChangeHP.bind(this));
		}

		if (this._mode !== BaseActorSheet.MODES.EDIT) {
			// TODO: See if this is needed
			// this.element.querySelectorAll('input[type="text"][data-dtype="Number"]')
			// 	.forEach(i => i.addEventListener("change", this._onChangeInputDelta.bind(this)));
		}

		// Prevent default middle-click scrolling when locking a tooltip
		this.element.addEventListener("pointerdown", event => {
			if (event.button === 1 && document.getElementById("tooltip")?.classList.contains("active")) {
				event.preventDefault();
			}
		});
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*            Event Handlers           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	// _disableFields(form) {
	// 	super._disableFields(form);
	// 	for (const button of form.querySelectorAll('[data-action="expand"], [data-action="view"]')) {
	// 		button.disabled = false;
	// 	}
	// }

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle a click on an action link.
	 * @param {ClickEvent} event - Triggering click event.
	 * @param {DOMStringMap} [dataset] - Dataset to use instead of that of the event target.
	 * @returns {Promise}
	 */
	async _onAction(event, dataset) {
		// 	const { action, subAction, ...properties } = dataset ?? event.currentTarget.dataset;
		// 	switch (action) {
		// 		case "effect":
		// 			return BlackFlagActiveEffect.onEffectAction.bind(this)(event);
		// 		case "item":
		// 			const itemId = properties.itemId ?? event.target.closest("[data-item-id]")?.dataset.itemId;
		// 			const item = this.actor.items.get(itemId);
		// 			switch (subAction) {
		// 				case "delete":
		// 					return item?.deleteDialog();
		// 				case "edit":
		// 				case "view":
		// 					return item?.sheet.render(true);
		// 			}
		// 			break;
		// 	}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle changes to the HP and damage on character sheets.
	 * @param {Event} event - Triggering event.
	 */
	_onChangeHP(event) {
		event.stopPropagation();
		let value = event.target.value.trim();
		let delta;
		if (value.startsWith("+") || value.startsWith("-")) delta = parseInt(value);
		else {
			if (value.startsWith("=")) value = value.slice(1);
			delta = parseInt(value) - foundry.utils.getProperty(this.actor, event.target.name);
		}

		this.actor.applyDamage(delta, { multiplier: -1 });
		event.target.value = foundry.utils.getProperty(this.actor, event.target.name);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle resting the actor.
	 * @this {BaseActorSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 */
	static #rest(event, target) {
		this.actor.rest({ type: target.dataset.type });
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	// _onEditImage(event) {
	// 	const attr = event.currentTarget.dataset.edit;
	// 	const current = foundry.utils.getProperty(this.object, attr);
	// 	const { img } = this.document.constructor.getDefaultArtwork?.(this.document.toObject()) ?? {};
	// 	const fp = new foundry.applications.apps.FilePicker({
	// 		current,
	// 		type: "image",
	// 		redirectToRoot: img ? [img] : [],
	// 		callback: path => {
	// 			event.currentTarget.src = path;
	// 			if (this.options.submitOnChange) return this._onSubmit(event, { updateData: { [attr]: path } });
	// 		},
	// 		top: this.position.top + 40,
	// 		left: this.position.left + 10,
	// 		document: this.document
	// 	});
	// 	return fp.browse();
	// }

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle rolling from the sheet.
	 * @this {BaseActorSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 * @returns {any}
	 */
	static #roll(event, target) {
		// if ( !target.classList.contains("rollable") ) return;
		if (this._roll(event, target) === false) return;
		const { action: _, subAction, ...properties } = target.dataset;
		properties.event = event;
		return this.actor.roll(subAction, properties);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle rolling from the sheet.
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 * @returns {any} - Return `false` to prevent default behavior.
	 * @protected
	 */
	_roll(event, target) {}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle showing the Actor's art.
	 * @this {BaseActorSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 */
	static #showArtwork(event, target) {
		new foundry.applications.apps.ImagePopout({
			src: event.target.src,
			uuid: this.actor.uuid,
			window: { title: this.actor.name }
		}).render({ force: true });
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle opening a configuration application.
	 * @this {BaseActorSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 * @returns {any}
	 */
	static #showConfiguration(event, target) {
		if (this._showConfiguration(event, target) === false) return;
		const options = { document: this.actor, selectedId: target.dataset.key };
		switch (target.dataset.type) {
			case "ability":
				return new AbilityConfig(options).render({ force: true });
			case "armor-class":
				return new ArmorClassConfig(options).render({ force: true });
			case "health":
				return new HealthConfig(options).render({ force: true });
			case "initiative":
				return new InitiativeConfig(options).render({ force: true });
			case "language":
				return new LanguageConfig(options).render({ force: true });
			case "luck":
				return new LuckConfig(options).render({ force: true });
			case "movement":
				return new MovementConfig(options).render({ force: true });
			case "proficiency":
				return new ProficiencyConfig(options).render({ force: true });
			case "resistance":
				return new ResistanceConfig(options).render({ force: true });
			case "senses":
				return new SensesConfig(options).render({ force: true });
			case "skill":
				return new SkillConfig(options).render({ force: true });
			case "tool":
				return new ToolConfig(options).render({ force: true });
			case "type":
				return new TypeConfig(options).render({ force: true });
			case "vehicle":
				return new ToolConfig({ ...options, trait: "vehicles" }).render({ force: true });
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle opening a configuration application.
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 * @returns {any} - Return `false` to prevent default behavior.
	 * @abstract
	 */
	_showConfiguration(event, target) {}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Form Submission           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_processFormData(event, form, formData) {
		const submitData = super._processFormData(event, form, formData);

		// Preserve item updates to send to items
		// const itemUpdates = Object.entries(updates.item ?? {}).map(([_id, data]) => {
		// 	return { _id, ...data };
		// });
		// delete updates.item;
		// await this.actor.updateEmbeddedDocuments("Item", itemUpdates);

		return submitData;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*             Drag & Drop             */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	// 	async _onDrop(event) {
	// 		const { data } = CONFIG.ux.DragDrop.getDragData(event);
	//
	// 		// TODO: Handle folders
	// 		// Forward dropped effects to the effects element
	// 		if (data.type === "ActiveEffect") {
	// 			if (Hooks.call("dropActorSheetData", this.actor, this, data) === false) return;
	// 			EffectsElement.dropEffects(event, this.actor, [await ActiveEffect.implementation.fromDropData(data)]);
	// 			return;
	// 		}
	//
	// 		// Forward dropped items to the inventory element
	// 		else if (data.type === "Item") {
	// 			if (Hooks.call("dropActorSheetData", this.actor, this, data) === false) return;
	// 			InventoryElement.dropItems(event, this.actor, [await Item.implementation.fromDropData(data)]);
	// 			return;
	// 		}
	//
	// 		super._onDrop(event);
	// 	}
}
