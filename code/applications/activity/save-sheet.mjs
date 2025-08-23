import ActivitySheet from "./activity-sheet.mjs";

/**
 * Application for configuring Save activities.
 */
export default class SaveSheet extends ActivitySheet {
	/** @inheritDoc */
	static DEFAULT_OPTIONS = {
		classes: ["save-activity"]
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static PARTS = {
		...super.PARTS,
		effect: {
			template: "systems/black-flag/templates/activity/save-effect.hbs",
			templates: [
				"systems/black-flag/templates/activity/parts/activity-effects.hbs",
				"systems/black-flag/templates/activity/parts/damage-part.hbs",
				"systems/black-flag/templates/activity/parts/damage-parts.hbs",
				"systems/black-flag/templates/activity/parts/save-damage.hbs",
				"systems/black-flag/templates/activity/parts/save-details.hbs",
				"systems/black-flag/templates/activity/parts/save-effect-settings.hbs"
			]
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	_prepareAppliedEffectContext(context, effect) {
		effect.additionalSettings = "systems/black-flag/templates/activity/parts/save-effect-settings.hbs";
		return effect;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareEffectContext(context) {
		context = await super._prepareEffectContext(context);

		const group = game.i18n.localize("BF.Formula.Default.DC");
		context.abilityOptions = [
			{ value: "custom", label: game.i18n.localize("BF.Formula.Custom.Label") },
			{ value: "spellcasting", label: game.i18n.localize("BF.Spellcasting.Label") },
			...CONFIG.BlackFlag.abilities.localizedOptions.map(o => ({ ...o, group }))
		];
		const defaultAbility = this.activity.system.defaultAbility;
		if (defaultAbility) {
			context.abilityOptions.unshift(
				{
					value: "",
					label: game.i18n.format("BF.Default.Specific", { default: game.i18n.localize(defaultAbility).toLowerCase() })
				},
				{ rule: true }
			);
		}

		context.onSaveOptions = [
			{ value: "none", label: game.i18n.localize("BF.SAVE.FIELDS.damage.onSave.none") },
			{ value: "half", label: game.i18n.localize("BF.SAVE.FIELDS.damage.onSave.half") },
			{ value: "full", label: game.i18n.localize("BF.SAVE.FIELDS.damage.onSave.full") }
		];

		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareIdentityContext(context) {
		context = await super._prepareIdentityContext(context);
		context.behaviorFields.push({
			field: context.systemFields.save.fields.visible,
			value: context.source.system.save.visible
		});
		return context;
	}
}
