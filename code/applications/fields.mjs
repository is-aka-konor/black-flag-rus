/**
 * Create a select input for a SelectField.
 * @param {StringField} field - The field.
 * @param {FormInputConfig<string>} config - The input configuration.
 * @returns {HTMLElement|HTMLCollection}
 */
export function createSelectInput(field, config) {
	return foundry.applications.fields.createSelectInput(config);
}
