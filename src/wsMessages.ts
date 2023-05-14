import { WsMsg0Dispatch } from "./WsMessageDispatch.ts";
const browser_user_agent =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36";
const browser_version = "113.0.0.0";

export interface WsProperties {
  os: string;
  browser: string;
  device: string;
  system_locale: string;
  browser_user_agent: string;
  browser_version: string;
  os_version: string;
  referrer: string;
  referring_domain: string;
  referrer_current: string;
  referring_domain_current: string;
  release_channel: "stable";
  client_build_number: number;
  client_event_source: null;
}

export const properties: WsProperties = {
  os: "Windows",
  browser: "Chrome",
  device: "",
  system_locale: "fr-FR",
  browser_user_agent,
  browser_version,
  os_version: "10",
  referrer: "https://discord.com/",
  referring_domain: "discord.com",
  referrer_current: "",
  referring_domain_current: "",
  release_channel: "stable",
  client_build_number: 198146,
  client_event_source: null,
};

export const WsOpcode = {
  DISPATCH: 0,
  HEARTBEAT: 1,
  IDENTIFY: 2,
  PRESENCE_UPDATE: 3,
  VOICE_STATE_UPDATE: 4,
  VOICE_SERVER_PING: 5,
  RESUME: 6,
  RECONNECT: 7,
  REQUEST_GUILD_MEMBERS: 8,
  INVALID_SESSION: 9,
  HELLO: 10,
  HEARTBEAT_ACK: 11,
  CALL_CONNECT: 13,
  GUILD_SUBSCRIPTIONS: 14,
  LOBBY_CONNECT: 15,
  LOBBY_DISCONNECT: 16,
  LOBBY_VOICE_STATES_UPDATE: 17,
  STREAM_CREATE: 18,
  STREAM_DELETE: 19,
  STREAM_WATCH: 20,
  STREAM_PING: 21,
  STREAM_SET_PAUSED: 22,
  REQUEST_GUILD_APPLICATION_COMMANDS: 24,
  EMBEDDED_ACTIVITY_LAUNCH: 25,
  EMBEDDED_ACTIVITY_CLOSE: 26,
  EMBEDDED_ACTIVITY_UPDATE: 27,
  REQUEST_FORUM_UNREADS: 28,
  REMOTE_COMMAND: 29,
  GET_DELETED_ENTITY_IDS_NOT_MATCHING_HASH: 30,
  REQUEST_SOUNDBOARD_SOUNDS: 31,
  SPEED_TEST_CREATE: 32,
  SPEED_TEST_DELETE: 33,
  REQUEST_LAST_MESSAGES: 34,
} as const;

// DISPATCH

// HEARTBEAT
export interface WsMsg1Heartbeat {
  op: 1;
  d: number;
}

/**
 * IDENTIFY
 */
export interface WsMsg2Identify {
  op: 2;
  d: {
    token: string;
    capabilities: number; // 8189,
    properties: WsProperties;
    presence: {
      status: "online" | "unknown";
      since: 0;
      activities: [];
      afk: boolean;
    };
    compress: boolean;
    client_state: {
      guild_versions: {};
      highest_last_message_id: "0";
      read_state_version: 0;
      user_guild_settings_version: -1;
      user_settings_version: -1;
      private_channels_version: "0";
      api_code_version: 0;
    };
  };
}

/**
 * PRESENCE_UPDATE
 */
export interface WsMsg3PresenceUpdate {
  op: 3;
  d: {
    status: "online" | "unknown";
    since: 0;
    activities: [];
    afk: boolean;
  };
}

/**
 * VOICE_STATE_UPDATE
 */
export interface WsMsg4VoiceStateUpadate {
  op: 4;
  d: {
    guild_id: string | null;
    channel_id: string | null;
    self_mute: string | true;
    self_deaf: string | false;
    self_video: string | false;
    flags: string | 2;
  };
}
/**
 * VOICE_SERVER_PING
 */
export interface WsMsg5ServerPing {
  op: 5;
  d: {};
}

/**
 * RESUME
 */
export interface WsMsg6Resume {
  op: 6;
  d: {
    token: string;
    session_id: string;
    seq: number;
  };
}

export interface WsMsg9InvalidSession {
  t: null;
  s: null;
  op: 9;
  d: false;
}

export interface WsMsg10Hello {
  t: null;
  s: null;
  op: 10;
  d: {
    heartbeat_interval: 41250;
    _trace: ['["gateway-prd-us-east1-b-wwpd",{"micros":0.0}]'];
  };
}

// HEARTBEAT_ACK
export interface WsMsg11HeartbeatAck {
  op: 11;
  t: null;
  s: null;
  d: null;
}

export interface WsMsg14GuildSubscriptions {
  op: 14;
  d: {
    guild_id: string;
    typing: true;
    threads: true;
    activities: true;
    members: [];
    channels: {};
    thread_member_lists: [];
  };
}

export type WsMessage =
  | WsMsg0Dispatch
  | WsMsg1Heartbeat
  | WsMsg2Identify
  | WsMsg3PresenceUpdate
  | WsMsg4VoiceStateUpadate
  | WsMsg5ServerPing
  | WsMsg6Resume
  // | WsMsg7Reconnect
  // | WsMsg8RequestGuildMemebers
  | WsMsg9InvalidSession
  | WsMsg10Hello
  | WsMsg11HeartbeatAck
  // ??
  // | WsMsg13CallConnect
  | WsMsg14GuildSubscriptions
  // | WsMsg15LobbyConnect
  // | WsMsg16LobbyDisconnect
  // | WsMsg17LobbyVoiceStatesUpdate
  // | WsMsg18StreamCreate
  // | WsMsg19StreamDelete
  // | WsMsg20StreamWatch
  // | WsMsg21StreamPing
  // | WsMsg22StreamSetPaused
  // | WsMsg24RequestGuildApplicationCommands
  // | WsMsg25EmbeddedActivityLaunch
  // | WsMsg26EmbeddedActivityClose
  // | WsMsg27EmbeddedActivityUpdate
  // | WsMsg28RequestForumUnreads
  // | WsMsg29RemoteCommand
  // | WsMsg30GetDeletedEntityIdsNotMatchingHash
  // | WsMsg31RequestSoundboardSounds
  // | WsMsg32SpeedTestCreate
  // | WsMsg33SpeedTestDelete
  // | WsMsg34RequestLastMessages  
  ;
