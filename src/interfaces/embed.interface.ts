/**
 * The interface for an embed field.
 */
export interface IEmbedField {
  /** The name of the field. */
  name: string;

  /** The value of the field. */
  value: string;

  /** Whether the field should be inline. */
  inline?: boolean;
}

/**
 * The interface for an embed footer.
 */
export interface IEmbedFooter {
  /** The text of the footer. */
  text: string;

  /** The icon URL of the footer. */
  iconURL?: string;
}

/**
 * The interface for an embed author.
 */
export interface IEmbedAuthor {
  /** The name of the author. */
  name: string;

  /** The icon URL of the author. */
  iconURL?: string;
}

/**
 * The interface for an embed.
 */
export interface IEmbed {
  /** The title of the embed. */
  title?: string;

  /** The description of the embed. */
  description?: string;

  /** The color of the embed represented as a hexadecimal number. */
  color?: number;

  /** The fields of the embed. Each field should have a name and a value, and can also have an inline property. */
  fields?: IEmbedField[];

  /** The thumbnail of the embed. */
  thumbnail?: string;

  /** The image of the embed. */
  image?: string;

  /** The footer of the embed. The footer should have a text property and can also have an iconURL property. */
  footer?: IEmbedFooter;

  /** The author of the embed. The author should have a name property and can also have an iconURL property. */
  author?: IEmbedAuthor;

  /** The URL of the embed. */
  url?: string;

  /** Whether to set the timestamp of the embed. */
  setTimestamp?: boolean;
}
