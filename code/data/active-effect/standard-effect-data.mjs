import ActiveEffectDataModel from "../abstract/active-effect-data-model.mjs";

const { BooleanField, SchemaField, SetField, StringField } = foundry.data.fields;

/**
 * Data definition for Standard active effects.
 */
export default class StandardEffectData extends ActiveEffectDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.EFFECT.STANDARD", "BF.EFFECT.RIDER"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static metadata = Object.freeze(
		foundry.utils.mergeObject(
			super.metadata,
			{
				type: "standard",
				localization: "BF.EFFECT.Type.Standard"
			},
			{ inplace: false }
		)
	);

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static defineSchema() {
		return this.mergeSchema(super.defineSchema(), {
			magical: new BooleanField(),
			rider: new SchemaField({
				statuses: new SetField(new StringField())
			})
		});
	}
}
