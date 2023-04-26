
export interface CommandOpt {
    type: 3,
    name: string,
    description: string,
    required: boolean,
}

export interface Command {
    id: string,
    application_id: string,
    version: string,
    default_member_permissions: null, // any 
    type: 1,
    nsfw: boolean,
    name: "imagine" | "settings",
    description: string,
    dm_permission: boolean,
    contexts: null,
    options?: CommandOpt[]
}
export interface Payload {
    type: 1 | 2 | 3 | 4;
    application_id: string,
    guild_id: string,
    channel_id: string,
    session_id: string,
    data: {
        version: string,
        id: string,
        name: string,
        type: 1,
        options: any[],
        application_command: Command,
        attachments: any[],
    },
}
