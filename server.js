* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: #1a1a1a;
  height: 100vh;
  overflow: hidden;
  color: #e0e0e0;
}

#app {
  height: 100vh;
}

/* Auth Screen */
.auth-screen {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.auth-container {
  background: #2a2a3e;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
}

.auth-logo {
  text-align: center;
  font-weight: 800;
  font-size: 32px;
  letter-spacing: 4px;
  margin-bottom: 30px;
  color: #fff;
  text-shadow: 0 2px 10px rgba(100,150,255,0.3);
}

.auth-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.auth-tab {
  flex: 1;
  padding: 12px;
  background: #3a3a4e;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  color: #aaa;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-tab.active {
  background: #5a7aff;
  color: #fff;
}

.auth-form {
  display: none;
  flex-direction: column;
  gap: 15px;
}

.auth-form.active {
  display: flex;
}

.auth-form input {
  padding: 14px;
  background: #3a3a4e;
  border: 1px solid #4a4a5e;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border 0.2s;
}

.auth-form input:focus {
  border-color: #5a7aff;
}

.auth-form button {
  padding: 14px;
  background: #5a7aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.auth-form button:hover {
  background: #4a6ae0;
}

.error-message {
  color: #ff6b6b;
  font-size: 12px;
  text-align: center;
  min-height: 20px;
}

/* Main Screen */
.main-screen {
  display: flex;
  height: 100vh;
  background: #1e1e2e;
}

/* Server Sidebar */
.server-sidebar {
  width: 72px;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  gap: 8px;
  border-right: 1px solid #2a2a4e;
}

.server-icon {
  width: 52px;
  height: 52px;
  background: #2a2a4e;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  color: #aaa;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.server-icon:hover {
  background: #3a3a5e;
  color: #fff;
  border-radius: 14px;
}

.server-icon.active {
  background: #5a7aff;
  color: #fff;
  border-radius: 14px;
}

.home-icon {
  font-size: 24px;
}

.server-separator {
  width: 40px;
  height: 2px;
  background: #2a2a4e;
  margin: 4px 0;
}

.server-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.server-actions {
  margin-top: auto;
  position: relative;
}

.add-server-btn {
  width: 52px;
  height: 52px;
  background: #2a2a4e;
  border: 2px dashed #3a3a6e;
  border-radius: 16px;
  color: #5a7aff;
  font-size: 28px;
  cursor: pointer;
  transition: all 0.2s;
}

.add-server-btn:hover {
  background: #3a3a5e;
  border-color: #5a7aff;
}

.server-menu {
  position: absolute;
  bottom: 60px;
  left: 0;
  background: #2a2a4e;
  border-radius: 8px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.menu-option {
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: #fff;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 4px;
  text-align: left;
}

.menu-option:hover {
  background: #3a3a6e;
}

.server-user {
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #2a2a4e;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: #5a7aff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
}

.server-user .user-info {
  text-align: center;
}

.server-user #currentUsername {
  color: #fff;
  font-size: 11px;
  font-weight: 600;
}

.server-user #currentUserStatus {
  color: #4caf50;
  font-size: 9px;
}

.logout-icon {
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.6;
}

.logout-icon:hover {
  opacity: 1;
}

/* Home Panel */
.home-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e2e;
}

.home-tabs {
  display: flex;
  border-bottom: 1px solid #2a2a4e;
  padding: 0 16px;
  gap: 4px;
}

.home-tab {
  padding: 10px 16px;
  background: transparent;
  border: none;
  color: #aaa;
  font-weight: 700;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-notification {
  width: 8px;
  height: 8px;
  background: #ff4757;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  right: 6px;
  box-shadow: 0 0 10px rgba(255, 71, 87, 0.5);
}

.home-tab:hover {
  color: #fff;
  background: #2a2a3e;
}

.home-tab.active {
  color: #fff;
  border-bottom-color: #5a7aff;
}

.home-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background: #1e1e2e;
}

.home-content > div {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.friends-view, .pending-view, .add-friend-view, .dms-view {
  display: none;
}

.friends-view.active, .pending-view.active, .add-friend-view.active, .dms-view.active {
  display: block;
}

.friend-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #252535;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: background 0.2s;
}

.friend-item:hover {
  background: #2a2a4e;
}

.friend-avatar {
  width: 48px;
  height: 48px;
  background: #5a7aff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  cursor: pointer;
  font-size: 18px;
}

.friend-info {
  flex: 1;
  cursor: pointer;
}

.friend-name {
  font-weight: 700;
  color: #fff;
  font-size: 15px;
}

.friend-status {
  font-size: 12px;
  color: #4caf50;
  margin-top: 2px;
}

.friend-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.message-btn {
  background: #5a7aff;
  color: #fff;
}

.message-btn:hover {
  background: #4a6ae0;
}

.profile-btn {
  background: #3a3a5e;
  color: #fff;
}

.profile-btn:hover {
  background: #4a4a7e;
}

.add-friend-form {
  max-width: 500px;
  margin: 40px auto;
  padding: 30px;
  text-align: center;
  background: #252535;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.add-friend-form h3 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 8px;
}

.add-friend-form p {
  color: #aaa;
  margin-bottom: 24px;
  font-size: 14px;
}

.add-friend-input-wrapper {
  display: flex;
  background: #1a1a2e;
  padding: 6px;
  border-radius: 50px;
  border: 1px solid #3a3a5e;
  gap: 8px;
  transition: border-color 0.2s;
}

.add-friend-input-wrapper:focus-within {
  border-color: #5a7aff;
}

.add-friend-input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 10px 20px;
  font-size: 15px;
  outline: none;
}

.add-friend-input-wrapper button {
  padding: 10px 24px;
  background: #5a7aff;
  color: #fff;
  border: none;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.add-friend-input-wrapper button:hover {
  background: #4a6ae0;
  transform: scale(1.02);
}

.dm-list {
  padding: 0;
}

.dm-list-title {
  color: #5a7aff;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  margin-bottom: 16px;
  padding: 0 4px;
}

.dm-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  margin-bottom: 4px;
}

.dm-item:hover {
  background: #252535;
}

.dm-avatar {
  width: 44px;
  height: 44px;
  background: #3a3a5e;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 16px;
}

.dm-name {
  font-weight: 700;
  color: #fff;
  font-size: 15px;
}

.dm-last-message {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

/* DM Panel */
.dm-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1e1e2e;
}

.dm-header {
  padding: 14px 20px;
  border-bottom: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.back-btn:hover {
  background: #252535;
  color: #fff;
}

#dmRecipientName {
  font-weight: 700;
  color: #fff;
  font-size: 16px;
}

.dm-info-btn {
  margin-left: auto;
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}

.dm-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.dm-typing {
  padding: 4px 20px;
  color: #5a7aff;
  font-size: 12px;
  font-style: italic;
  min-height: 24px;
}

.dm-input-area {
  padding: 16px 20px;
  border-top: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a1a2e;
}



.dm-input-area button {
  padding: 10px 16px;
  background: #5a7aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.attach-btn, .voice-btn, .emoji-btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: background 0.2s;
}

.attach-btn:hover, .voice-btn:hover, .emoji-btn:hover {
  background: #2a2a4e;
}

/* Server Panel */
.server-panel {
  flex: 1;
  display: flex;
  background: #1e1e2e;
}

.server-panel-sidebar {
  width: 240px;
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2a2a4e;
}

.server-header {
  padding: 16px;
  border-bottom: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: #fff;
}

.server-menu-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
}

.channel-list {
  flex: 1;
  padding: 12px 8px;
}

.channel {
  padding: 8px 12px;
  margin: 2px 0;
  color: #aaa;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.channel:hover {
  background: #252535;
  color: #fff;
}

.channel.active {
  background: #3a3a5e;
  color: #fff;
}

.server-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 14px 20px;
  border-bottom: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-icon {
  color: #aaa;
  font-size: 20px;
}

#currentChannel {
  font-weight: 700;
  color: #fff;
}

.chat-header-actions {
  margin-left: auto;
  display: flex;
  gap: 8px;
}

.chat-header-actions button {
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.chat-header-actions button:hover {
  background: #252535;
  color: #fff;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  display: flex;
  gap: 12px;
  padding: 4px 0;
}

.message-avatar {
  width: 40px;
  height: 40px;
  background: #5a7aff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  font-size: 14px;
  flex-shrink: 0;
  cursor: pointer;
}

.message-content-wrapper {
  flex: 1;
}

.message-header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 4px;
}

.message-sender {
  font-weight: 700;
  color: #fff;
  cursor: pointer;
}

.message-sender:hover {
  text-decoration: underline;
}

.message-time {
  font-size: 11px;
  color: #888;
}

.message-text {
  color: #e0e0e0;
  line-height: 1.5;
  word-break: break-word;
}

.message-text .mention {
  background: #3a3a6e;
  color: #5a7aff;
  padding: 1px 4px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
}

.message-attachments {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.message-attachment {
  max-width: 300px;
  max-height: 200px;
  border-radius: 8px;
  cursor: pointer;
}

.message-attachment.video, .message-attachment.audio {
  max-width: 400px;
}

.message-reply {
  border-left: 2px solid #5a7aff;
  padding-left: 12px;
  margin-bottom: 8px;
  color: #aaa;
  font-size: 13px;
}

.message-reply-sender {
  color: #5a7aff;
  font-weight: 600;
}

.message-edited {
  font-size: 10px;
  color: #888;
  margin-left: 8px;
}

.message-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.message-action {
  background: none;
  border: none;
  color: #aaa;
  font-size: 14px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.message-action:hover {
  background: #2a2a4e;
  color: #fff;
}

.chat-typing {
  padding: 4px 20px;
  color: #5a7aff;
  font-size: 12px;
  font-style: italic;
  min-height: 24px;
}

.chat-input-area {
  padding: 16px 20px;
  border-top: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  gap: 8px;
  background: #1a1a2e;
}

.chat-input-area textarea, .dm-input-area textarea {
  flex: 1;
  padding: 12px 16px;
  background: #252535;
  border: 1px solid #3a3a4e;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  resize: none;
  min-height: 44px;
  max-height: 200px;
  line-height: 1.4;
  font-family: inherit;
  transition: border-color 0.2s;
}

.chat-input-area textarea:focus, .dm-input-area textarea:focus {
  border-color: #5a7aff;
}

.chat-input-area button {
  padding: 10px 16px;
  background: #5a7aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

/* Roster Panel */
.roster-panel {
  width: 240px;
  background: #1a1a2e;
  border-left: 1px solid #2a2a4e;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.roster-panel.hidden {
  display: none;
}

.roster-header {
  padding: 16px;
  border-bottom: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-weight: 700;
}

.roster-header button {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 18px;
}

.roster-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 8px;
}

.roster-member {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}

.roster-member:hover {
  background: #252535;
}

.roster-member-avatar {
  width: 32px;
  height: 32px;
  background: #3a3a5e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #fff;
  font-size: 12px;
}

.roster-member-name {
  color: #e0e0e0;
  font-weight: 500;
}

.roster-member-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: auto;
}

.roster-member-status.online {
  background: #4caf50;
}

.roster-member-status.offline {
  background: #888;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: none;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #2a2a4e;
  border-radius: 12px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #3a3a5e;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  color: #fff;
}

.modal-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 20px;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.modal-body input {
  width: 100%;
  padding: 14px;
  background: #1e1e2e;
  border: 1px solid #3a3a5e;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  outline: none;
  margin-bottom: 16px;
}

.modal-body input:focus {
  border-color: #5a7aff;
}

.modal-body button {
  width: 100%;
  padding: 14px;
  background: #5a7aff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.image-modal {
  max-width: 90vw;
  max-height: 90vh;
  background: transparent;
}

.image-modal img {
  max-width: 100%;
  max-height: 85vh;
  border-radius: 8px;
}

/* Context Menu */
.context-menu {
  position: fixed;
  background: #2a2a4e;
  border-radius: 8px;
  padding: 4px;
  min-width: 180px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 1001;
}

.context-item {
  padding: 10px 16px;
  color: #e0e0e0;
  font-size: 14px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.context-item:hover {
  background: #3a3a6e;
}

.context-item.danger {
  color: #ff6b6b;
}

.context-item.danger:hover {
  background: #5e2a2a;
}

/* Voice Recorder */
.voice-recorder {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #2a2a4e;
  padding: 16px 24px;
  border-radius: 40px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  z-index: 500;
}

.voice-recorder-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

#recordingTime {
  color: #ff6b6b;
  font-weight: 700;
  font-size: 18px;
}

.voice-recorder button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
}

#stopRecordingBtn {
  background: #ff6b6b;
  color: #fff;
}

#cancelRecordingBtn {
  background: #3a3a5e;
  color: #aaa;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #3a3a5e;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #4a4a6e;
}
/* ===== WARM BLACK & WHITE FIXES ===== */
/* Override colors without deleting anything */
body, .main-screen, .home-panel, .dm-panel, .server-panel,
.server-panel-sidebar, .chat-input-area, .dm-input-area,
.modal, .context-menu, .voice-recorder {
  background: #1a1a1a !important;
}

.server-sidebar {
  background: #141414 !important;
}

.server-icon, .add-server-btn, .friend-item, .dm-item, .channel,
.auth-container, .modal, .context-menu {
  background: #242424 !important;
  border-color: #3a3a3a !important;
}

.server-icon:hover, .friend-item:hover, .dm-item:hover, .channel:hover {
  background: #333333 !important;
}

input, textarea, .auth-form input, .chat-input-area input, .dm-input-area input {
  background: #1e1e1e !important;
  border: 1px solid #444 !important;
  color: #ffffff !important;
}

button:not(.auth-tab):not(.home-tab) {
  background: #d4d4d4 !important;
  color: #1a1a1a !important;
  font-weight: 600 !important;
}

button:hover:not(.auth-tab):not(.home-tab) {
  background: #ffffff !important;
}

.auth-tab.active, .home-tab.active {
  background: #d4d4d4 !important;
  color: #1a1a1a !important;
}

/* ===== FIX + BUTTON POSITION ===== */
.server-sidebar {
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
}

.server-list {
  flex: 1 !important;
  overflow-y: auto !important;
  max-height: calc(100vh - 200px) !important;
}

.server-actions {
  margin-top: 8px !important;
  margin-bottom: 8px !important;
}

/* ===== FIX USER PANEL ===== */
.server-user {
  margin-top: 0 !important;
  padding: 16px 8px !important;
  border-top: 1px solid #3a3a3a !important;
  width: 100% !important;
}

/* ===== MESSAGE TEXT COLOR ===== */
.message-text, .friend-name, .dm-name, .channel, #currentChannel,
#currentServerName, .modal-header span, .roster-header span {
  color: #ffffff !important;
}

.message-time, .friend-status, .dm-last-message {
  color: #a0a0a0 !important;
}
/* Voice Recorder */
.voice-recorder {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #242424;
  border: 1px solid #444;
  border-radius: 40px;
  padding: 12px 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
  z-index: 1000;
}

.voice-recorder-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.recording-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recording-dot {
  font-size: 16px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

#recordingTime {
  color: #ff5555;
  font-weight: 700;
  font-size: 18px;
  font-variant-numeric: tabular-nums;
}

.recording-actions {
  display: flex;
  gap: 12px;
}

.recording-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.recording-btn.stop {
  background: #ff5555;
  color: #fff;
}

.recording-btn.stop:hover {
  background: #ff3333;
}

.recording-btn.cancel {
  background: #3a3a3a;
  color: #aaa;
}

.recording-btn.cancel:hover {
  background: #4a4a4a;
  color: #fff;
}

/* ==================== COMPLETE DISCORD MOBILE LAYOUT ==================== */
@media (max-width: 768px) {
  /* ===== BASE LAYERING ===== */
  .main-screen {
    position: relative !important;
    width: 100vw !important;
    height: 100vh !important;
    overflow: hidden !important;
    background: #1a1a2e !important;
  }
  
  /* Server sidebar - left edge */
  .server-sidebar {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    width: 72px !important;
    z-index: 10 !important;
    background: #1a1a2e !important;
    padding-top: 12px !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
  }
  
  .server-icon {
    margin-bottom: 8px !important;
  }
  
  /* Channel sidebar - slides from left */
  .server-panel-sidebar {
    position: absolute !important;
    top: 0 !important;
    left: 72px !important;
    bottom: 0 !important;
    width: 280px !important;
    z-index: 20 !important;
    background: #1a1a2e !important;
    transform: translateX(-100%) !important;
    transition: transform 0.2s ease !important;
    padding-top: 56px !important;
    overflow-y: auto !important;
    border-right: 1px solid #2a2a4e !important;
  }
  
  .server-panel-sidebar.open {
    transform: translateX(0) !important;
  }
  
  .channel {
    padding: 12px 16px !important;
    margin: 2px 0 !important;
    font-size: 16px !important;
    color: #b9bbbe !important;
    border-radius: 4px !important;
  }
  
  .channel.active {
    background: #3a3a5e !important;
    color: #fff !important;
  }
  
  /* Chat area - always visible, full screen */
  .server-chat {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    z-index: 5 !important;
    display: flex !important;
    flex-direction: column !important;
    background: #1a1a2e !important;
  }
  
  /* ===== HEADER ===== */
  .chat-header {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 12px 16px !important;
    min-height: 56px !important;
    background: #1a1a2e !important;
    border-bottom: 1px solid #2a2a4e !important;
    display: flex !important;
    align-items: center !important;
    z-index: 6 !important;
  }
  
  .menu-btn {
    display: block !important;
    background: none !important;
    border: none !important;
    color: #fff !important;
    font-size: 24px !important;
    padding: 8px 12px 8px 0 !important;
    margin-right: 8px !important;
    cursor: pointer !important;
  }
  
  .channel-icon {
    font-size: 20px !important;
    margin-right: 6px !important;
    color: #b9bbbe !important;
  }
  
  #currentChannel {
    flex: 1 !important;
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #fff !important;
  }
  
  #rosterToggle {
    background: none !important;
    border: none !important;
    color: #b9bbbe !important;
    font-size: 22px !important;
    padding: 8px !important;
    cursor: pointer !important;
  }
  
  /* ===== MESSAGES CONTAINER ===== */
  .chat-messages,
  .messages-container {
    position: absolute !important;
    top: 56px !important;
    bottom: 70px !important;
    left: 0 !important;
    right: 0 !important;
    padding: 16px 12px !important;
    overflow-y: auto !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 16px !important;
  }
  
  /* Message bubbles */
  .message {
    display: flex !important;
    gap: 12px !important;
    padding: 0 !important;
  }
  
  .message-avatar {
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    flex-shrink: 0 !important;
    background: #5a7aff !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-weight: 700 !important;
    color: #fff !important;
  }
  
  .message-content-wrapper {
    flex: 1 !important;
  }
  
  .message-header {
    display: flex !important;
    align-items: baseline !important;
    gap: 8px !important;
    margin-bottom: 4px !important;
  }
  
  .message-sender {
    font-size: 16px !important;
    font-weight: 600 !important;
    color: #fff !important;
  }
  
  .message-time {
    font-size: 12px !important;
    color: #72767d !important;
  }
  
  .message-text {
    font-size: 16px !important;
    line-height: 1.5 !important;
    color: #dcddde !important;
    word-break: break-word !important;
    padding-right: 16px !important;
  }
  
  .message.system {
    text-align: center !important;
    padding: 16px !important;
    color: #72767d !important;
    font-size: 14px !important;
  }
  
  /* ===== INPUT AREA ===== */
  .chat-input-area {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 10px 16px !important;
    min-height: 70px !important;
    background: #1a1a2e !important;
    border-top: 1px solid #2a2a4e !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
    z-index: 50 !important;
  }
  
  .chat-input-area input {
    flex: 1 !important;
    padding: 14px 16px !important;
    background: #2a2a4e !important;
    border: none !important;
    border-radius: 24px !important;
    color: #fff !important;
    font-size: 16px !important;
    outline: none !important;
  }
  
  .attach-btn,
  .voice-btn,
  .emoji-btn {
    background: none !important;
    border: none !important;
    color: #b9bbbe !important;
    font-size: 24px !important;
    padding: 8px !important;
    cursor: pointer !important;
  }
  
  #sendBtn {
    display: none !important;
  }
  
  /* ===== OVERLAY ===== */
  .drawer-overlay {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    background: rgba(0,0,0,0.6) !important;
    z-index: 15 !important;
    display: none !important;
  }
  
  .drawer-overlay.show {
    display: block !important;
  }
  
  /* ===== ROSTER PANEL ===== */
  .roster-panel {
    position: absolute !important;
    top: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 280px !important;
    z-index: 40 !important;
    background: #1a1a2e !important;
    transform: translateX(100%) !important;
    transition: transform 0.2s ease !important;
    padding-top: 56px !important;
    border-left: 1px solid #2a2a4e !important;
  }
  
  .roster-panel.open {
    transform: translateX(0) !important;
  }
  
  .roster-header {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 12px 16px !important;
    min-height: 56px !important;
    background: #1a1a2e !important;
    border-bottom: 1px solid #2a2a4e !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }
  
  .roster-list {
    height: 100% !important;
    overflow-y: auto !important;
    padding: 8px !important;
  }
  
  .roster-member {
    padding: 12px 16px !important;
    border-radius: 4px !important;
    margin-bottom: 2px !important;
  }
  
  /* ===== HOME PANEL ===== */
  .home-panel {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 5 !important;
    background: #1a1a2e !important;
    overflow-y: auto !important;
  }
  
  .home-content {
    padding: 16px !important;
  }
  
  .friend-item {
    padding: 14px !important;
    margin-bottom: 8px !important;
    background: #2a2a4e !important;
    border-radius: 8px !important;
  }
  
  /* ===== DM PANEL ===== */
  .dm-panel {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    z-index: 5 !important;
    background: #1a1a2e !important;
  }
  
  .dm-header {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 12px 16px !important;
    min-height: 56px !important;
    background: #1a1a2e !important;
    border-bottom: 1px solid #2a2a4e !important;
    display: flex !important;
    align-items: center !important;
    z-index: 6 !important;
  }
  
  .dm-messages {
    position: absolute !important;
    top: 56px !important;
    bottom: 70px !important;
    left: 0 !important;
    right: 0 !important;
    padding: 16px 12px !important;
    overflow-y: auto !important;
  }
  
  .dm-input-area {
    position: absolute !important;
    bottom: 0 !important;
    left: 0 !important;
    right: 0 !important;
    padding: 10px 16px !important;
    min-height: 70px !important;
    background: #1a1a2e !important;
    border-top: 1px solid #2a2a4e !important;
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  
  .dm-input-area input {
    flex: 1 !important;
    padding: 14px 16px !important;
    background: #2a2a4e !important;
    border: none !important;
    border-radius: 24px !important;
    color: #fff !important;
    font-size: 16px !important;
  }
  
  #dmSendBtn {
    display: none !important;
  }
  
  /* ===== HIDDEN ELEMENTS ===== */
  .home-tabs,
  .server-user,
  .server-separator,
  .chat-header-actions button:not(#rosterToggle) {
    display: none !important;
  }
  
  /* ===== TOUCH FRIENDLY ===== */
  button,
  .channel,
  .friend-item,
  .dm-item,
  .roster-member {
    min-height: 48px !important;
    cursor: pointer !important;
  }
}
/* ===== GIPHY PICKER STYLES ===== */
.giphy-picker {
  position: fixed !important;
  z-index: 99999 !important;
  display: none;
  background: #1a1a2e !important;
  border-radius: 12px !important;
  border: 1px solid #3a3a5e !important;
  width: 420px !important;
  max-width: 95vw !important;
  height: 500px !important;
  max-height: 80vh !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.6) !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
}

.giphy-results {
  flex: 1 !important;
  padding: 12px !important;
  overflow-y: auto !important;
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 8px !important;
  align-content: start !important;
}

.giphy-item {
  cursor: pointer !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  background: #2a2a4e !important;
  aspect-ratio: 1 / 1 !important;
  position: relative !important;
}

.giphy-item img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  display: block !important;
}

.giphy-item:hover {
  box-shadow: 0 0 0 2px #5a7aff !important;
  transform: scale(1.02) !important;
  transition: all 0.15s ease !important;
}

.giphy-tab {
  flex: 1 !important;
  padding: 8px !important;
  background: #2a2a4e !important;
  border: none !important;
  color: #aaa !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  font-weight: 600 !important;
  font-size: 13px !important;
  transition: all 0.15s !important;
}

.giphy-tab.active {
  background: #3a3a5e !important;
  color: #fff !important;
}

.giphy-tab:hover {
  background: #3a3a6e !important;
  color: #fff !important;
}

.giphy-search {
  width: 100% !important;
  padding: 10px !important;
  background: #2a2a4e !important;
  border: none !important;
  border-radius: 8px !important;
  color: #fff !important;
  outline: none !important;
  font-size: 14px !important;
  margin-top: 8px !important;
}

.giphy-search:focus {
  box-shadow: 0 0 0 2px #5a7aff !important;
}

.giphy-footer {
  padding: 8px !important;
  border-top: 1px solid #2a2a4e !important;
  font-size: 11px !important;
  color: #666 !important;
  text-align: center !important;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .giphy-picker {
    width: 100vw !important;
    max-width: 100vw !important;
    height: 60vh !important;
    bottom: 70px !important;
    left: 0 !important;
    right: 0 !important;
    border-radius: 12px 12px 0 0 !important;
  }
}
#gifResults {
  display: grid !important;
  grid-template-columns: repeat(2, 1fr) !important;
  gap: 6px !important;
}

#gifResults > div {
  grid-column: span 1 !important;
}
/* ===== MESSAGE REACTIONS ===== */
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.reaction-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #2a2a4e;
  border-radius: 8px;
  font-size: 12px;
  color: #e0e0e0;
  cursor: pointer;
  transition: background 0.15s;
  border: 1px solid transparent;
}

.reaction-badge:hover {
  background: #3a3a5e;
}

.reaction-badge.active {
  background: #3a3a6e;
  border-color: #5a7aff;
}

.reaction-badge .emoji {
  font-size: 14px;
}

.reaction-badge .count {
  font-size: 11px;
  color: #aaa;
}

.reaction-picker {
  position: absolute;
  z-index: 1000;
  background: #1a1a2e;
  border-radius: 8px;
  padding: 6px;
  display: flex;
  gap: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  border: 1px solid #3a3a5e;
}

.reaction-option {
  padding: 6px 10px;
  font-size: 18px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s;
}

.reaction-option:hover {
  background: #2a2a4e;
}

/* ===== PINNED MESSAGES ===== */
.pinned-messages-bar {
  padding: 8px 16px;
  background: #2a2a3e;
  border-bottom: 1px solid #3a3a5e;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #e0e0e0;
}

.pinned-messages-bar:hover {
  background: #3a3a4e;
}

.pinned-messages-bar .pin-icon {
  color: #5a7aff;
  font-size: 14px;
}

.pinned-message-preview {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pinned-messages-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a2e;
  border-radius: 12px;
  border: 1px solid #3a3a5e;
  width: 500px;
  max-width: 90vw;
  max-height: 70vh;
  z-index: 10000;
  display: none;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.pinned-modal-header {
  padding: 16px;
  border-bottom: 1px solid #2a2a4e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: #fff;
}

.pinned-modal-close {
  background: none;
  border: none;
  color: #aaa;
  font-size: 18px;
  cursor: pointer;
}

.pinned-modal-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.pinned-message-item {
  padding: 12px;
  border-radius: 8px;
  background: #252535;
  margin-bottom: 8px;
  position: relative;
}

.pinned-message-item:hover {
  background: #2a2a4e;
}

.pin-action-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.15s;
}

.pinned-message-item:hover .pin-action-btn {
  opacity: 1;
}

.message-pin-icon {
  margin-left: 8px;
  color: #5a7aff;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}

.message:hover .message-pin-icon {
  opacity: 1;
}

.modal-overlay-pins {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 9999;
  display: none;
}
/* ===== REACTION STYLES ===== */
.msg-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.msg-reactions span {
  transition: all 0.15s ease;
  user-select: none;
}

.message .react-btn,
.message .pin-btn {
  opacity: 0.6;
  transition: opacity 0.15s;
}

.message .react-btn:hover,
.message .pin-btn:hover {
  opacity: 1;
}

/* Reaction picker overlay fix */
#emojiPicker.show {
  display: block !important;
}

/* Pinned messages modal scrollbar */
#pinsModal::-webkit-scrollbar {
  width: 4px;
}

#pinsModal::-webkit-scrollbar-thumb {
  background: #3a3a5e;
  border-radius: 2px;
}
/* ===== DISCORD-STYLE PINS & REACTIONS ===== */
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}

.reaction-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #2a2a4e;
  border-radius: 8px;
  font-size: 12px;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.reaction-badge:hover {
  background: #3a3a5e;
}

.reaction-badge.active {
  background: #3a3a6e;
  border-color: #5a7aff;
}

.reaction-badge .emoji {
  font-size: 14px;
}

.reaction-badge .count {
  font-size: 11px;
  color: #aaa;
}

.reaction-badge.add-reaction {
  opacity: 0;
  transition: opacity 0.15s;
}

.message:hover .reaction-badge.add-reaction {
  opacity: 1;
}

/* Pinned Messages Bar */
.pinned-messages-bar {
  padding: 8px 16px;
  background: #2a2a3e;
  border-bottom: 1px solid #3a3a5e;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #e0e0e0;
  transition: background 0.15s;
}

.pinned-messages-bar:hover {
  background: #3a3a4e;
}

/* Pinned Messages Modal */
.pinned-message-item {
  background: #252535;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  position: relative;
  transition: background 0.15s;
}

.pinned-message-item:hover {
  background: #2a2a4e;
}

/* Message Actions */
.message-actions {
  display: flex;
  gap: 4px;
  margin-top: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-actions {
  opacity: 1;
}

.message-action {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.15s;
}

.message-action:hover {
  background: #2a2a4e;
  color: #fff;
}
.message-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.reaction-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #2a2a4e;
  border-radius: 8px;
  font-size: 12px;
  color: #e0e0e0;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.15s;
}

.reaction-badge:hover {
  background: #3a3a5e;
}

.reaction-badge.active {
  background: #3a3a6e;
  border-color: #5a7aff;
}

.reaction-badge.add-reaction {
  opacity: 0;
  border: 1px dashed #3a3a5e;
}

.message:hover .reaction-badge.add-reaction {
  opacity: 1;
}
.message.system {
  justify-content: center;
  padding: 8px 0;
}

.message.system span {
  background: #2a2a4e;
  color: #aaa;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.message.system strong {
  color: #5a7aff;
}
.message.system {
  justify-content: center;
  padding: 4px 0;
  pointer-events: none;
}

.message.system .message-content-wrapper {
  background: transparent;
  padding: 4px 12px;
  border-radius: 4px;
}

.message.system .message-header {
  display: none;
}

.message.system .message-text {
  color: #888 !important;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.message.system .message-actions {
  display: none !important;
}

.message.system .message-avatar {
  display: none;
}

.message.system strong {
  color: #aaa;
  font-weight: 600;
}
.message.system {
  background: rgba(90, 122, 255, 0.05) !important;
  border-left: 3px solid #5a7aff !important;
}

.message.system .system-sender {
  color: #5a7aff !important;
  font-weight: 600;
}

.message.system .system-text {
  color: #aaa !important;
  font-style: italic;
}

.message.system .message-actions {
  opacity: 0;
}

.message.system:hover .message-actions {
  opacity: 1;
}
.emoji-suggestions {
  font-family: 'Inter', sans-serif;
}

.emoji-suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #2a2a4e;
  transition: background 0.15s;
}

.emoji-suggestion-item:last-child {
  border-bottom: none;
}

.emoji-suggestion-item:hover,
.emoji-suggestion-item.selected {
  background: #3a3a6e;
}

.emoji-suggestion-item span:last-child {
  font-size: 13px;
}
.message.compact {
  padding-top: 2px !important;
  padding-bottom: 2px !important;
}

.message.compact .message-content-wrapper {
  margin-left: 48px !important;
}

.message.compact .compact-timestamp {
  opacity: 0;
  transition: opacity 0.15s;
}

.message.compact:hover .compact-timestamp {
  opacity: 1 !important;
}

.message.compact .message-actions {
  margin-top: 2px !important;
}
.mention-suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid #2a2a4e;
  transition: background 0.15s;
}

.mention-suggestion-item:hover,
.mention-suggestion-item.selected {
  background: #3a3a6e;
}

.mention-avatar {
  width: 28px;
  height: 28px;
  background: #5a7aff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 700;
  font-size: 12px;
}

.mention-username {
  flex: 1;
  color: #fff;
}

.mention-status {
  font-size: 10px;
}

.mention-status.online {
  color: #4caf50;
}
/* Attachment preview */
#attachmentPreviewContainer {
  max-height: 200px;
  overflow-y: auto;
}

.upload-progress .progress-bar {
  transition: width 0.3s ease;
}

.cancel-attachment {
  opacity: 0.6;
  transition: opacity 0.15s;
}

.cancel-attachment:hover {
  opacity: 1;
  color: #ff4757 !important;
}
