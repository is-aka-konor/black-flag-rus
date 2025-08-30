import AdvancementDataModel from "../abstract/advancement-data-model.mjs";

const { ArrayField, NumberField, SchemaField, StringField } = foundry.data.fields;

/**
 * Configuration data for the Property advancement.
 */
export class PropertyConfigurationData extends AdvancementDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.Advancement.Property"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static defineSchema() {
		return {
			changes: new ArrayField(
				new SchemaField({
					key: new StringField({ required: true }),
					value: new StringField({ required: true }),
					mode: new NumberField({ integer: true, initial: CONST.ACTIVE_EFFECT_MODES.ADD }),
					priority: new NumberField()
				})
			)
		};
	}
}
