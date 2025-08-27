const ALL_DOCUMENT_TYPES = [...CONST.ALL_DOCUMENT_TYPES, "Activity", "Advancement"];

/**
 * Version of core's DocumentUUIDField that supports activities or advancement as document types.
 */
export default class DocumentUUIDField extends foundry.data.fields.DocumentUUIDField {
	/** @override */
	_validateType(value) {
		const p = foundry.utils.parseUuid(value);
		if (this.type) {
			if (p.type !== this.type) throw new Error(`Invalid document type "${p.type}" which must be a "${this.type}"`);
		} else if (p.type && !ALL_DOCUMENT_TYPES.includes(p.type)) throw new Error(`Invalid document type "${p.type}"`);
		if (this.embedded === true && !p.embedded.length) throw new Error("must be an embedded document");
		if (this.embedded === false && p.embedded.length) throw new Error("may not be an embedded document");
		if (!foundry.data.validators.isValidId(p.documentId)) throw new Error(`Invalid document ID "${p.documentId}"`);
	}
}
