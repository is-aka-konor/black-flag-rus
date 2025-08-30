import AdvancementDataModel from "../abstract/advancement-data-model.mjs";

const { SetField, StringField } = foundry.data.fields;

/**
 * Configuration data for the Size advancement.
 */
export class SizeConfigurationData extends AdvancementDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.Advancement.Size"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static defineSchema() {
		return {
			options: new SetField(new StringField(), { initial: ["medium"] })
		};
	}
}

/**
 * Value data for the Size advancement.
 */
export class SizeValueData extends foundry.abstract.DataModel {
	/** @override */
	static defineSchema() {
		return {
			selected: new StringField({ label: "BF.Size.Label" })
		};
	}
}
