import AdvancementDataModel from "../abstract/advancement-data-model.mjs";

const { SetField, StringField } = foundry.data.fields;

/**
 * Configuration data for the Key Ability advancement.
 */
export class KeyAbilityConfigurationData extends AdvancementDataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.Advancement.KeyAbility"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static defineSchema() {
		return {
			options: new SetField(new StringField())
		};
	}
}
