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

import { IInteractionDefer, IInteractionDelete, IInteractionReply } from '../interfaces/interaction.interface.js';

/**
 * Reply to an interaction
 * @param interaction - The interaction object
 * @param replyOptions - The options for replying to the interaction
 * @param deleteOptions - The options for deleting the reply
 * @returns A promise that resolves after the reply is sent / deleted
 * @throws An error if the interaction is not provided or if neither content nor embeds are provided
 */
export async function reply(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  replyOptions: IInteractionReply,
  deleteOptions: IInteractionDelete = { deleteTime: -1 }
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error('interaction not provided');
    if (!replyOptions.content && !replyOptions.embeds) throw new Error('content nor embeds not provided');

    //Reply to the interaction
    if (interaction.deferred || interaction.replied)
      await interaction.editReply(replyOptions as InteractionEditReplyOptions);
    else await interaction.reply(replyOptions as InteractionReplyOptions);

    //Delete the reply after deleteTime seconds
    if (deleteOptions.deleteTime > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await interaction.deleteReply();
          resolve();
        }, deleteOptions.deleteTime * 1000);
      });
    }
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
  deferOptions: IInteractionDefer = { ephemeral: false }
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error('interaction not provided');

    //Deferr the interaction if it's not already deferred or replied
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply(deferOptions as InteractionDeferReplyOptions);
    }
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
    //Check if the interaction and options are provided
    if (!interaction) throw new Error('interaction not provided');

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
 * Delete the reply to an interaction.
 * @param interaction - The interaction object
 * @param deleteOptions - The options for deleting the reply
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
  deleteOptions: IInteractionDelete = { deleteTime: -1 }
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error('interaction not provided');

    //Delete the reply after deleteTime seconds or immediately if deleteTime is not provided
    if (deleteOptions.deleteTime > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await interaction.deleteReply();
          resolve();
        }, deleteOptions.deleteTime * 1000);
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
 * @param  interaction - The interaction object
 * @param  replyOptions - The options for following up the interaction
 * @param  deleteOptions - The options for deleting the reply
 * @returns A promise that resolves after the follow up is sent / deleted
 * @throws An error if the interaction is not provided or if neither content nor embeds are provided
 */
export async function followUp(
  interaction:
    | ChatInputCommandInteraction
    | MessageContextMenuCommandInteraction
    | UserContextMenuCommandInteraction
    | MessageComponentInteraction
    | ModalSubmitInteraction,
  replyOptions: IInteractionReply,
  deleteOptions: IInteractionDelete = { deleteTime: -1 }
): Promise<void> {
  try {
    //Check if the interaction and options are provided
    if (!interaction) throw new Error('interaction not provided');
    if (!replyOptions.content && !replyOptions.embeds) throw new Error('content nor embeds not provided');

    //Follow up the interaction if it's already replied to, e.o.c. reply to the interaction
    if (interaction.replied) await interaction.followUp(replyOptions as InteractionReplyOptions);
    else await interaction.reply(replyOptions as InteractionReplyOptions);

    //Delete the reply after deleteTime seconds
    if (deleteOptions.deleteTime > 0) {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await interaction.deleteReply();
          resolve();
        }, deleteOptions.deleteTime * 1000);
      });
    }
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
export async function update(interaction: MessageComponentInteraction, replyOptions: IInteractionReply): Promise<void> {
  try {
    // Check if the interaction is provided
    if (!interaction) throw new Error('interaction not provided');

    // Check if either content or embeds are provided
    if (!replyOptions.content && !replyOptions.embeds) throw new Error('neither content nor embeds provided');

    // Update the interaction
    await interaction.update(replyOptions as InteractionUpdateOptions);
  } catch (error: any) {
    error.message = `updating interaction: ${error.message}`;
    throw error;
  }
}

/**
 * Defer an update to an interaction
 * @param interaction - The interaction object
 * @param IInteractionDefer [deferOptions={ephemeral=false}] - The options for deferring the update
 * @returns  A promise that resolves after the update is deferred
 * @throws - An error if the interaction is not provided
 */
export async function deferUpdate(
  interaction: MessageComponentInteraction,
  deferOptions: IInteractionDefer = { ephemeral: false }
): Promise<void> {
  try {
    // Check if the interaction is provided
    if (!interaction) throw new Error('interaction not provided');

    // Defer the interaction if it's not already deferred or replied
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferUpdate(deferOptions as InteractionDeferUpdateOptions);
    }
  } catch (error: any) {
    error.message = `deferring interaction update: ${error.message}`;
    throw error;
  }
}
