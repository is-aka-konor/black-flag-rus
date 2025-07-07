import BaseStatBlockSheet from "./api/base-stat-block-sheet.mjs";

/**
 * Sheet for siege weapon actors.
 */
export default class SiegeWeaponSheet extends BaseStatBlockSheet {
	/** @override */
	static DEFAULT_OPTIONS = {
		classes: ["siege-weapon"]
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static enrichedFields = {
		description: "system.description.value"
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static PARTS = {
		...super.PARTS,
		main: {
			...super.PARTS.main,
			template: "systems/black-flag/templates/actor/tabs/siege-weapon-main.hbs"
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _prepareContext(options) {
		const context = await super._prepareContext(options);

		context.enriched = await this._prepareDescriptions(context);
		context.labels = {
			sizeAndType: `${game.i18n.localize(CONFIG.BlackFlag.sizes[context.system.traits.size]?.label ?? "")} ${game.i18n.localize(
				"BF.Object"
			)}`
		};

		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	async _prepareBiographyContext(context, options) {
		context.portrait = this._preparePortrait(context);
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*      Actor Preparation Helpers      */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	async _prepareActions(context) {
		await super._prepareActions(context);
		for (const [key, { items }] of Object.entries(context.actions)) {
			context.passive.push(...items);
			delete context.actions[key];
		}
		context.passive.findSplice(d => d.item.identifier === "siege-weapon-resilience");
	}
}
