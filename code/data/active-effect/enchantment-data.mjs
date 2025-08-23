import ActiveEffectDataModel from "../abstract/active-effect-data-model.mjs";

const { BooleanField } = foundry.data.fields;

/**
 * Data definition for Enchantment active effects.
 */
export default class EchantmentData extends ActiveEffectDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.ENCHANTMENT"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static metadata = Object.freeze(
		foundry.utils.mergeObject(
			super.metadata,
			{
				type: "enchantment",
				localization: "BF.EFFECT.Type.Enchantment"
			},
			{ inplace: false }
		)
	);

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static defineSchema() {
		return this.mergeSchema(super.defineSchema(), {
			magical: new BooleanField({ initial: true })
		});
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Properties             */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Has this enchantment been applied by another item, or was it directly created.
	 * @type {boolean}
	 */
	get isApplied() {
		return !!this.origin && this.origin !== this.parent.uuid;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Data Preparation          */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	prepareDerivedData() {
		super.prepareDerivedData();
		if (this.isApplied) {
			// TODO: Add to enchanted items registry
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*            Event Handlers           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	onRenderActiveEffectConfig(app, html, context) {
		const toRemove = html.querySelectorAll('.form-group:has([name="transfer"], [name="statuses"])');
		toRemove.forEach(f => f.remove());
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*        Socket Event Handlers        */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _preCreate(data, options, user) {
		if ((await super._preCreate(data, options, user)) === false) return false;
		if (this.parent.parent instanceof Actor) {
			ui.notifications.error("BF.ENCHANTMENT.Warning.NotOnActor", { localize: true });
			return false;
		}
		// TODO: Validate enchantment restrictions
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_onDelete(options, userId) {
		super._onDelete(options, userId);
		if (this.isApplied) {
			// TODO: Remove from enchanted items registry
		}
	}
}
