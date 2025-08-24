const { SetField, StringField } = foundry.data.fields;

/**
 * Data definition template for Items with properties.
 *
 * @property {Set<string>} properties  List of applied properties.
 */
export default class PropertiesTemplate extends foundry.abstract.DataModel {

	/** @inheritDoc */
	static defineSchema() {
		return {
			properties: new SetField(new StringField(), {label: "BF.Property.Label[other]"})
		};
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Properties             */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Properties that can be applied to this object.
	 * @type {Map<string, string>}
	 */
	get validProperties() {
		const validProperties = CONFIG.BlackFlag[`${this.parent.type}Properties`];
		if ( !validProperties ) return new Map();
		return Object.entries(CONFIG.BlackFlag.itemProperties.localized).reduce((map, [k, l]) => {
			if ( validProperties.includes(k) ) map.set(k, l);
			return map;
		}, new Map());
	}
}
