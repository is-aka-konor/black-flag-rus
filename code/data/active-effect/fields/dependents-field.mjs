import DocumentUUIDField from "../../fields/document-uuid-field.mjs";

const { ArrayField, SchemaField } = foundry.data.fields;

/**
 * @typedef DependentData
 * @param {string} uuid - UUID of the dependent document.
 */

/**
 * A field for storing dependent documents for an active effect.
 *
 * @param {object} [fields={}] - Additional fields to track with the dependent.
 * @param {string} [fields.type] - Document type represented by the dependent.
 * @param {DataFieldOptions} [options={}] - Options forwarded to the SetField.
 */
export default class DependentsField extends ArrayField {
	constructor({ type, ...fields } = {}, options = {}) {
		fields = {
			uuid: new DocumentUUIDField({ type: type in CONST.ALL_DOCUMENT_TYPES ? type : undefined }),
			...fields
		};
		super(new SchemaField(fields), { ...options, type });
	}
}
