const { BooleanField, StringField } = foundry.data.fields;

/**
 * @typedef {"distance"|"pace"|"volume"|"weight"} LocalizableUnitType
 */

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
	 * @param {LocalizableUnitType} type - Type of unit to select.
	 * @returns {string}
	 */
	defaultUnit(type) {
		if (!(type in CONFIG.BlackFlag.defaultUnits)) {
			throw new Error(`Unit type "${type}" does not have a registered default.`);
		}
		return (
			CONFIG.BlackFlag.defaultUnits[type]?.[this.preferredSystem(type)] ??
			Object.values(CONFIG.BlackFlag.defaultUnits[type] ?? {})[0]
		);
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Retrieve the preferred measurement system for a specific unit type.
	 * @param {LocalizableUnitType} type - Type of unit to select.
	 * @returns {string|void}
	 */
	preferredSystem(type) {
		return this[{ cargo: "weight", pace: "distance" }[type] ?? type];
	}
}
