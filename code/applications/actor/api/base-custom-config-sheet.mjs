import BaseConfigSheet from "./base-config-sheet.mjs";

/**
 * Base configuration application that supports adding & deleting custom values.
 */
export default class BaseCustomConfigSheet extends BaseConfigSheet {
	/** @override */
	static DEFAULT_OPTIONS = {
		actions: {
			addCustom: BaseCustomConfigSheet.#addCustom,
			deleteCustom: BaseCustomConfigSheet.#deleteCustom
		},
		customKeyPath: ""
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*            Event Handlers           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle adding a custom tag.
	 * @this {BaseCustomConfigSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 */
	static #addCustom(event, target) {
		this.submit({ newCustom: true });
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle removing a custom tag.
	 * @this {BaseCustomConfigSheet}
	 * @param {Event} event - Triggering click event.
	 * @param {HTMLElement} target - Button that was clicked.
	 */
	static #deleteCustom(event, target) {
		this.submit({ deleteCustom: Number(target.dataset.index) });
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Form Submission           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	_processFormData(event, form, formData) {
		const submitData = super._processFormData(event, form, formData);
		foundry.utils.setProperty(
			submitData,
			this.options.customKeyPath,
			Array.from(Object.values(submitData.custom ?? {}))
		);
		return submitData;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _processSubmitData(event, form, submitData, options = {}) {
		if (options.newCustom || options.deleteCustom !== undefined) {
			const custom = foundry.utils.getProperty(submitData, this.options.customKeyPath) ?? [];
			if (options.deleteCustom !== undefined) custom.splice(options.deleteCustom, 1);
			if (options.newCustom) custom.push("");
			foundry.utils.setProperty(submitData, this.options.customKeyPath, custom);
		}
		super._processSubmitData(event, form, submitData);
	}
}
