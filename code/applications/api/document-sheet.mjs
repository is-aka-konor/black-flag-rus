import EditImageMixin from "./edit-image-mixin.mjs";
import ApplicationV2Mixin from "./mixin.mjs";

const { DocumentSheetV2 } = foundry.applications.api;

/**
 * Base application from which all document-based Black Flag applications should be based.
 */
export default class BFDocumentSheet extends EditImageMixin(ApplicationV2Mixin(DocumentSheetV2)) {}
