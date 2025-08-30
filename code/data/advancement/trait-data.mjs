import AdvancementDataModel from "../abstract/advancement-data-model.mjs";

const { ArrayField, NumberField, SchemaField, SetField, StringField } = foundry.data.fields;

/**
 * Configuration data for the Trait advancement.
 */
export class TraitConfigurationData extends AdvancementDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.Advancement.Trait"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static defineSchema() {
		return {
			choiceMode: new StringField({ required: true, blank: false, initial: "inclusive" }),
			choices: new ArrayField(
				new SchemaField({
					count: new NumberField({ initial: 1, positive: true, integer: true }),
					pool: new SetField(new StringField())
				})
			),
			grants: new SetField(new StringField()),
			mode: new StringField({ required: true, blank: false, initial: "default" })
		};
	}
}

/**
 * Value data for the Trait advancement.
 */
export class TraitValueData extends foundry.abstract.DataModel {
	/** @override */
	static defineSchema() {
		return {
			selected: new SetField(new StringField(), {
				required: false,
				initial: undefined
			})
		};
	}
}
