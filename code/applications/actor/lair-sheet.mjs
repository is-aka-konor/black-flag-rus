import BaseActorSheet from "./api/base-actor-sheet.mjs";

/**
 * Actor sheet representing Lair actors.
 */
export default class LairSheet extends BaseActorSheet {
	/** @inheritDoc */
	static DEFAULT_OPTIONS = {
		actions: {
			addItem: LairSheet.#addItem,
			enterInitiative: LairSheet.#enterInitiative
		},
		classes: ["lair"],
		position: {
			width: 520
		},
		window: {
			controls: [
				{
					action: "enterInitiative",
					icon: "fa-solid fa-bolt",
					label: "BF.Initiative.Action.Enter",
					ownership: "OWNER",
					visible: LairSheet.#canEnterInitiative
				}
			]
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static enrichedFields = {
		description: "system.description.value",
		lairActions: "system.description.lairActions",
		regionalEffects: "system.description.regionalEffects",
		conclusion: "system.description.conclusion"
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static PARTS = {
		header: {
			template: "systems/black-flag/templates/actor/lair-header.hbs"
		},
		body: {
			template: "systems/black-flag/templates/actor/lair-body.hbs"
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _preparePartContext(partId, context, options) {
		context = await super._preparePartContext(partId, context, options);
		switch (partId) {
			case "body":
				return this._prepareBodyContext(context, options);
			case "header":
				return this._prepareHeaderContext(context, options);
			default:
				return context;
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareBodyContext(context, options) {
		context.enriched = await this._prepareDescriptions(context);
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareHeaderContext(context, options) {
		context = await super._prepareHeaderContext(context, options);
		context.portrait = this._preparePortrait(context);
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*       Item Preparation Helpers      */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareItem(item, context, section) {
		await super._prepareItem(item, context, section);
		context.activity = item.system.activities.find(a => a.activation.primary) ?? item.system.activities.contents[0];
		context.description = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
			item.system.description.value,
			{
				relativeTo: item,
				rollData: item.getRollData(),
				secrets: false,
				async: true
			}
		);
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*            Event Handlers           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle adding a new item to this lair.
	 * @this {LairSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 */
	static #addItem(event, target) {
		Item.implementation.createDialog(
			{ "system.type.category": "monsters", "system.type.value": target.dataset.type },
			{ parent: this.actor, pack: this.actor.pack, types: ["feature"] }
		);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle adding the lair to initiative.
	 * @this {LairSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 */
	static #enterInitiative(event, target) {
		this.actor.configureInitiativeRoll();
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*               Helpers               */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Control whether the Enter Initiative button is visible.
	 * @this {LairSheet}
	 * @returns {boolean}
	 */
	static #canEnterInitiative() {
		return !this.document.inCompendium;
	}
}
