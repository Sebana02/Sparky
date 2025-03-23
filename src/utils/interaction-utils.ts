import {
  ChatInputCommandInteraction,
  InteractionDeferReplyOptions,
  InteractionDeferUpdateOptions,
  InteractionEditReplyOptions,
  InteractionReplyOptions,
  InteractionUpdateOptions,
  Message,
  MessageComponentInteraction,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  UserContextMenuCommandInteraction,
} from 'discord.js';

/**
 * Reply to an interaction
 * @param interaction - The interaction object
 * @param replyOptions - The options for replying to the interaction
 * @param deleteTime - The time in seconds after which the reply should be deleted
 * @returns A promise that resolves after the reply is sent
 * @throws An error if the interaction is not provided or if neither content nor embeds are provided
 */
export async function reply(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  replyOptions: InteractionReplyOptions | InteractionEditReplyOptions,
  deleteTime: number = -1
): Promise<void> {
  try {
    //Reply to the interaction
    if (interaction.deferred || interaction.replied)
      await interaction.editReply(replyOptions as InteractionEditReplyOptions);
    else await interaction.reply(replyOptions as InteractionReplyOptions);

    //Delete the reply after deleteTime seconds
    if (deleteTime > 0) await deleteReply(interaction, deleteTime);
  } catch (error: any) {
    error.message = `replying interaction: ${error.message}`;
    throw error;
  }
}

/**
 * Defer a reply to an interaction
 * @param interaction - The interaction object
 * @param deferOptions - The options for deferring the reply
 * @returns A promise that resolves after the reply is deferred
 * @throws An error if the interaction is not provided
 */
export async function deferReply(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  deferOptions: InteractionDeferReplyOptions
): Promise<void> {
  try {
    //Deferr the interaction if it's not already deferred or replied
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply(deferOptions);
  } catch (error: any) {
    error.message = `deferring reply: ${error.message}`;
    throw error;
  }
}

/**
 * Fetch the reply to an interaction
 * @param interaction - The interaction object
 * @returns A promise that resolves with the reply to the interaction
 * @throws An error if the interaction is not provided
 */
export async function fetchReply(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction
): Promise<Message> {
  try {
    //Check if the interaction has been replied to
    if (!interaction.replied) throw new Error('interaction has not been replied to');

    //Return the reply to the interaction
    return await interaction.fetchReply();
  } catch (error: any) {
    error.message = `fetching reply: ${error.message}`;
    throw error;
  }
}

/**
 * Delete the reply to an interaction
 * @param interaction - The interaction object
 * @param deleteTime - The time in seconds after which the reply should be deleted
 * @returns A promise that resolves after the reply is deleted
 * @throws An error if the interaction is not provided
 */
export async function deleteReply(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  deleteTime: number = -1
): Promise<void> {
  try {
    //Delete the reply after deleteTime seconds or immediately if deleteTime is not provided
    if (deleteTime > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await interaction.deleteReply();
          resolve();
        }, deleteTime * 1000);
      });
    } else {
      await interaction.deleteReply();
    }
  } catch (error: any) {
    error.message = `deleting reply: ${error.message}`;
    throw error;
  }
}

/**
 * Follow up an interaction
 * @param interaction - The interaction object
 * @param replyOptions - The options for following up the interaction
 * @param deleteTime - The time in seconds after which the reply should be deleted
 * @returns A promise that resolves after the follow-up is sent
 * @throws An error if the interaction is not provided or if neither content nor embeds are provided
 */
export async function followUp(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  replyOptions: InteractionReplyOptions,
  deleteTime: number = -1
): Promise<void> {
  try {
    //Follow up the interaction if it's already replied to, e.o.c. reply to the interaction
    if (interaction.replied) await interaction.followUp(replyOptions);
    else await reply(interaction, replyOptions);

    //Delete the reply after deleteTime seconds
    if (deleteTime > 0) await deleteReply(interaction, deleteTime);
  } catch (error: any) {
    error.message = `following up interaction: ${error.message}`;
    throw error;
  }
}

/**
 * Update an interaction
 * @param interaction - The interaction object
 * @param replyOptions - The options for updating the interaction
 * @returns A promise that resolves after the update is sent
 * @throws An error if the interaction is not provided or if neither content nor embeds are provided
 */
export async function update(
  interaction: MessageComponentInteraction,
  replyOptions: InteractionUpdateOptions
): Promise<void> {
  try {
    // Update the interaction
    await interaction.update(replyOptions);
  } catch (error: any) {
    error.message = `updating interaction: ${error.message}`;
    throw error;
  }
}

/**
 * Defer an update to an interaction
 * @param interaction - The interaction object
 * @param deferOptions - The options for deferring the update
 * @returns A promise that resolves after the update is deferred
 * @throws An error if the interaction is not provided
 */
export async function deferUpdate(
  interaction: MessageComponentInteraction,
  deferOptions: InteractionDeferUpdateOptions
): Promise<void> {
  try {
    // Defer the interaction if it's not already deferred or replied
    if (!interaction.deferred && !interaction.replied) await interaction.deferUpdate(deferOptions);
  } catch (error: any) {
    error.message = `deferring interaction update: ${error.message}`;
    throw error;
  }
}
