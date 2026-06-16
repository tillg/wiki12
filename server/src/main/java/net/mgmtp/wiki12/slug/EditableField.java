package net.mgmtp.wiki12.slug;

/** A non-derived (user-editable) field: its absolute path + display label, for the change-log diff. */
public record EditableField(String path, String label) {
}
