import BlackFlagApplication from "./application.mjs";

/**
 * Special form application that acts like a dialog.
 */
export default class BFFormDialog extends BlackFlagApplication {
	/** @override */
	static DEFAULT_OPTIONS = {
		tag: "dialog",
		window: {
			contentTag: "form",
			contentClasses: ["standard-form"],
			minimizable: false
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	static PARTS = {
		content: {
			template: ""
		},
		footer: {
			template: "templates/generic/form-footer.hbs"
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	async _preparePartContext(partId, context, options) {
		context = await super._preparePartContext(partId, context, options);
		if (partId === "content") return this._prepareContentContext(context, options);
		if (partId === "footer") return this._prepareFooterContext(context, options);
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare rendering context for the content section.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @param {HandlebarsRenderOptions} options - Options which configure application rendering behavior.
	 * @returns {Promise<ApplicationRenderContext>}
	 * @protected
	 */
	async _prepareContentContext(context, options) {
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Prepare rendering context for the footer.
	 * @param {ApplicationRenderContext} context - Context being prepared.
	 * @param {HandlebarsRenderOptions} options - Options which configure application rendering behavior.
	 * @returns {Promise<ApplicationRenderContext>}
	 * @protected
	 */
	async _prepareFooterContext(context, options) {
		context.buttons = this.options.buttons?.map(button => ({
			...button,
			cssClass: button.class
		}));
		return context;
	}
}
