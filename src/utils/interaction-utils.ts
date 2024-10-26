import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  InteractionDeferReplyOptions,
  InteractionDeferUpdateOptions,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  Message,
} from "discord.js";

import {
  IInteractionDefer,
  IInteractionDelete,
  IInteractionReply,
} from "../interfaces/interaction.interface";

/**
 * Reply to an interaction
 * @param {ChatInputCommandInteraction} interaction - The interaction object
 * @param {IInteractionReply} replyOptions - The options for replying to the interaction
 * @param {IInteractionDelete} [deleteOptions=-1] - The time in seconds after which the reply should be deleted, if negative the reply will not be deleted
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the reply
 * @throws {Error} - If the interaction is not provided or if neither content nor embeds are provided
 * @returns {Promise<void>} - A promise that resolves after the reply is sent / deleted
 */
export async function reply(
  interaction: ChatInputCommandInteraction,
  replyOptions: IInteractionReply,
  deleteOptions: IInteractionDelete,
  propagate: boolean = true
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error("interaction not provided");

    if (!replyOptions.content && !replyOptions.embeds)
      throw new Error("content nor embeds not provided");

    //Reply to the interaction
    if (interaction.deferred || interaction.replied)
      await interaction.editReply(replyOptions as InteractionEditReplyOptions);
    else await interaction.reply(replyOptions as InteractionReplyOptions);

    //Delete the reply after deleteTime seconds
    if (deleteOptions.deleteTime > 0) {
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          await interaction.deleteReply().catch((error) => reject(error));
          resolve(null);
        }, deleteOptions.deleteTime * 1000);
      }).catch((error: any) => {
        error.message = `deleting reply: ${error.message}`;
        throw error;
      });
    }
  } catch (error: any) {
    error.message = `replying interaction: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}

/**
 * Defer a reply to an interaction
 * @param {ChatInputCommandInteraction} interaction - The interaction object
 * @param {IInteractionDefer} deferOptions - The options for deferring the reply
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the deferral
 * @throws {Error} - If the interaction is not provided
 * @returns {Promise<void>} - A promise that resolves after the reply is deferred
 */
export async function deferReply(
  interaction: ChatInputCommandInteraction,
  deferOptions: IInteractionDefer,
  propagate: boolean = true
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error("interaction not provided");

    //Deferr the interaction if it's not already deferred or replied
    if (!interaction.deferred && !interaction.replied)
      await interaction.deferReply(
        deferOptions as InteractionDeferReplyOptions
      );
  } catch (error: any) {
    error.message = `deferring reply: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}

/**
 * Fetch the reply to an interaction
 * @param {ChatInputCommandInteraction} interaction - The interaction object
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the fetch
 * @throws {Error} - If the interaction is not provided
 * @returns {Promise<Message | null>} - A promise that resolves with the reply message or null if the interaction has not been replied to
 * @throws {Error} - If the interaction is not provided or if the interaction has not been replied to
 * @returns {Promise<Message | null>} - A promise that resolves with the reply message or null if the interaction has not been replied to
 */
export async function fetchReply(
  interaction: ChatInputCommandInteraction,
  propagate: boolean = true
): Promise<Message | null> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error("interaction not provided");

    //Fetch the reply if the interaction is already replied to
    if (interaction.replied) return await interaction.fetchReply();

    throw new Error("interaction has not been replied to");
  } catch (error: any) {
    error.message = `fetching reply: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }

  return null;
}

/**
 * Delete the reply to an interaction
 * @param {ChatInputCommandInteraction} interaction - The interaction object
 * @param {IInteractionDelete} deleteOptions - The options for deleting the reply
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the deletion
 * @throws {Error} - If the interaction is not provided
 * @returns {Promise<void>} - A promise that resolves after the reply is deleted
 */
export async function deleteReply(
  interaction: ChatInputCommandInteraction,
  deleteOptions: IInteractionDelete,
  propagate: boolean = true
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error("interaction not provided");

    //Delete the reply after deleteTime seconds
    if (deleteOptions.deleteTime > 0) {
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          await interaction.deleteReply().catch((error) => reject(error));
          resolve(null);
        }, deleteOptions.deleteTime * 1000);
      }).catch((error) => {
        throw error;
      });
    } else await interaction.deleteReply();
  } catch (error: any) {
    error.message = `deleting reply: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}

/**
 * Follow up an interaction with a new message
 * @param {ChatInputCommandInteraction} interaction - The interaction object
 * @param {IInteractionReply} replyOptions - The options for following up the interaction
 * @param {IInteractionDelete} deleteOptions - The options for deleting the reply
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the follow-up
 * @throws {Error} - If the interaction is not provided or if neither content nor embeds are provided
 * @returns {Promise<void>} - A promise that resolves after the follow-up is sent / deleted
 */
export async function followUp(
  interaction: ChatInputCommandInteraction,
  replyOptions: IInteractionReply,
  deleteOptions: IInteractionDelete,
  propagate: boolean = true
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error("interaction not provided");

    if (!replyOptions.content && !replyOptions)
      throw new Error("content nor embeds not provided");

    //Follow up the interaction if it's already replied to, e.o.c. reply to the interaction
    if (interaction.replied)
      await interaction.followUp(replyOptions as InteractionReplyOptions);
    else await interaction.reply(replyOptions as InteractionReplyOptions);

    //Delete the reply after deleteTime seconds
    if (deleteOptions.deleteTime > 0) {
      await new Promise((resolve, reject) => {
        setTimeout(async () => {
          await interaction.deleteReply().catch((error) => reject(error));
          resolve(null);
        }, deleteOptions.deleteTime * 1000);
      }).catch((error) => {
        error.message = `deleting reply: ${error.message}`;
        throw error;
      });
    }
  } catch (error: any) {
    error.message = `following up interaction: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}

/**
 * Update an interaction
 * @param {ButtonInteraction} interaction - The interaction object
 * @param {IInteractionReply} replyOptions - The options for updating the interaction
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the update
 * @throws {Error} - If the interaction is not provided or if neither content nor embeds are provided
 * @returns {Promise<void>} - A promise that resolves after the update is sent
 */
export async function update(
  interaction: ButtonInteraction,
  replyOptions: IInteractionReply,
  propagate: boolean = true
): Promise<void> {
  try {
    // Check if the interaction is provided
    if (!interaction) throw new Error("interaction not provided");

    // Check if either content or embeds are provided
    if (!replyOptions.content && !replyOptions.embeds)
      throw new Error("neither content nor embeds provided");

    // Update the interaction
    await interaction.update(replyOptions as InteractionUpdateOptions);
  } catch (error: any) {
    error.message = `updating interaction: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}

/**
 * Defer an update to an interaction
 * @param {ButtonInteraction} interaction - The interaction object
 * @param {IInteractionDefer} deferOptions - The options for deferring the update
 * @param {boolean} [propagate=true] - Whether to propagate any errors that occur during the deferral
 * @throws {Error} - If the interaction is not provided
 * @returns {Promise<void>} - A promise that resolves after the update is deferred
 */
export async function deferUpdate(
  interaction: ButtonInteraction,
  deferOptions: IInteractionDefer,
  propagate: boolean = true
): Promise<void> {
  try {
    // Check if the interaction is provided
    if (!interaction) {
      throw new Error("interaction not provided");
    }

    // Defer the interaction if it's not already deferred or replied
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferUpdate(
        deferOptions as InteractionDeferUpdateOptions
      );
    }
  } catch (error: any) {
    error.message = `deferring interaction update: ${error.message}`;
    if (propagate) throw error;
    else logger.error(error.stack);
  }
}
