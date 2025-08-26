const { BooleanField, StringField } = foundry.data.fields;

/**
 * A data model containing settings for unit localization & conversion.
 */
export default class LocalizationSetting extends foundry.abstract.DataModel {
	/* <><><><> <><><><> <><><><> <><><><> */
	/*         Model Configuration         */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static LOCALIZATION_PREFIXES = ["BF.SETTINGS.LOCALIZATION"];

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static defineSchema() {
		return {
			distance: new StringField({ required: true, blank: false, initial: "imperial", systemSetting: true }),
			volume: new StringField({ required: true, blank: false, initial: "imperial", systemSetting: true }),
			weight: new StringField({ required: true, blank: false, initial: "imperial", systemSetting: true }),
			approximateConversion: new BooleanField({ initial: true })
		};
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*               Helpers               */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Determine the default unit that should be used for a certain usage type.
	 * @param {"distance"|"pace"|"volume"|"weight"} type - Type of unit to select.
	 * @returns {string}
	 */
	defaultUnit(type) {
		if (!(type in CONFIG.BlackFlag.defaultUnits)) {
			throw new Error(`Unit type "${type}" does not have a registered default.`);
		}
		let systemType = { cargo: "weight", pace: "distance" }[type] ?? type;
		return (
			CONFIG.BlackFlag.defaultUnits[type]?.[this[systemType]] ??
			Object.values(CONFIG.BlackFlag.defaultUnits[type] ?? {})[0]
		);
	}
}
