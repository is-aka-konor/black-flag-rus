const { SchemaField, StringField } = foundry.data.fields;

/**
 * Data definition template for actors with size & auto-sizing tokens.
 *
 * @property {object} traits
 * @property {object} traits.size - Creature size.
 */
export default class SizeTemplate extends foundry.abstract.DataModel {

	/** @override */
	static defineSchema() {
		return {
			traits: new SchemaField({
				size: new StringField({ label: "BF.Size.Label" })
			})
		};
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*        Socket Event Handlers        */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Update the prototype token size for newly created actors.
	 * @param {object} data - The initial data object provided to the document creation request.
	 * @param {object} options - Additional options which modify the creation request.
	 * @param {User} user - The User requesting the document creation.
	 */
	preCreateSize(data, options, user) {
		if ( !foundry.utils.hasProperty(data, "prototypeToken.width")
			&& !foundry.utils.hasProperty(data, "prototypeToken.height")) {
			const size = CONFIG.BlackFlag.sizes[this.traits.size]?.scale;
			this.parent.updateSource({ "prototypeToken.width": size, "prototypeToken.height": size });
		}
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Update token size when creature size is modified.
	 * @param {object} changes - The candidate changes to the Document.
	 * @param {object} options - Additional options which modify the update request.
	 * @param {BaseUser} user - The User requesting the document update.
	 */
	preUpdateSize(changes, options, user) {
		const newSize = foundry.utils.getProperty(changes, "system.traits.size");
		if ( !newSize || (newSize === this.traits.size) ) return;

		if ( !foundry.utils.hasProperty(changes, "prototypeToken.width")
			&& !foundry.utils.hasProperty(changes, "prototypeToken.height") ) {
			const size = CONFIG.BlackFlag.sizes[newSize]?.scale;
			foundry.utils.setProperty(changes, "prototypeToken.width", size);
			foundry.utils.setProperty(changes, "prototypeToken.height", size);
		}
	}
}
