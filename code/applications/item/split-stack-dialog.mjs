import BFFormDialog from "../api/form-dialog.mjs";

/**
 * Small dialog for splitting a stack of items into two.
 */
export default class SplitStackDialog extends BFFormDialog {
	/** @override */
	static DEFAULT_OPTIONS = {
		buttons: [
			{
				id: "split",
				label: "BF.SplitStack.Action",
				icon: "fa-solid fa-arrows-split-up-and-left"
			}
		],
		classes: ["split-stack"],
		document: null,
		form: {
			handler: SplitStackDialog.#handleFormSubmission
		},
		position: {
			width: 400
		},
		window: {
			title: "BF.SplitStack.Title"
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */

	/** @inheritDoc */
	static PARTS = {
		...super.PARTS,
		content: {
			template: "systems/black-flag/templates/item/split-stack-dialog.hbs"
		}
	};

	/* <><><><> <><><><> <><><><> <><><><> */
	/*              Rendering              */
	/* <><><><> <><><><> <><><><> <><><><> */

	/** @override */
	async _prepareContentContext(context, options) {
		const total = this.options.document.system.quantity ?? 1;
		context.max = Math.max(1, total - 1);
		context.left = Math.ceil(total / 2);
		context.right = total - context.left;
		return context;
	}

	/* <><><><> <><><><> <><><><> <><><><> */
	/*           Form Submission           */
	/* <><><><> <><><><> <><><><> <><><><> */

	/**
	 * Handle submission of the dialog.
	 * @this {SplitStackDialog}
	 * @param {Event|SubmitEvent} event - The form submission event.
	 * @param {HTMLFormElement} form - The submitted form.
	 * @param {FormDataExtended} formData - Data from the dialog.
	 */
	static async #handleFormSubmission(event, form, formData) {
		const right = formData.object.right ?? 0;
		const left = (this.options.document.system.quantity ?? 1) - right;
		if (left === this.options.document.system.quantity) return;
		await Promise.all([
			this.options.document.update({ "system.quantity": left }),
			this.options.document.clone({ "system.quantity": right }, { addSource: true, save: true })
		]);
		this.close();
	}
}
