import type { AuthUser } from '@/store/auth/models/auth-user';
import io from 'socket.io-client';
import { SocketEnum } from '@/shared/services/socket-service/socket.enum';
import { StoreNamespace } from '@/store/store-namespace';
import store from '@/store';
import { GET_USER } from '@/store/auth/constants';

const SOCKET_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_URL : '//localhost:3030';

export default class SocketService {
  public static url: string = SOCKET_URL;
  public static socket: ReturnType<typeof io> | null = null;
  public static listeners: Array<{ eventName: string; callback: (...arg: any) => void }> = [];
  public static emits: Array<{ eventName: string; data: any }> = [];

  public static setup(user: AuthUser = store.getters[`${StoreNamespace.AUTH_MODULE}/${GET_USER}`]) {
    if (this.isConnected()) {
      return;
    }

    this.socket = io(this.url, { reconnection: true, reconnectionDelay: 1000, reconnectionDelayMax: 5000 });

    this.socket.on('connect', () => {
      this.emit(SocketEnum.SETUP, { uid: user._id });

      this.listeners.forEach(({ eventName, callback }) => this.on(eventName, callback));
      this.emits.forEach(({ eventName, data }) => this.emit(eventName, data));

      this.emits = [];
    });
  }

  public static on(eventName: string, callback: (...arg: any) => void, hasUniqueName = false): void {
    if (!this.listeners.find((cache) => cache.eventName === eventName && (hasUniqueName || cache.callback === callback))) {
      this.listeners.push({ eventName, callback });
    }

    if (this.socket && !this.socket.hasListeners(eventName)) {
      this.socket.on(eventName, callback);
    }
  }

  public static off(eventName: string, callback?: (...arg: any) => void): void {
    this.listeners = this.listeners.filter((cache) => !(cache.eventName === eventName && (!callback || cache.callback === callback)));

    if (!this.socket) {
      return;
    }

    if (!callback) {
      this.socket.removeAllListeners(eventName);
    } else {
      this.socket.off(eventName);
    }
  }

  public static emit(eventName: string, ...data: any): void {
    if (!this.socket?.connected) {
      if (!this.emits.find((channel) => channel.eventName === eventName)) {
        this.emits.push({ eventName, data });
      }

      return;
    }

    this.socket.emit(eventName, ...data);
  }

  public static join(chatId: string | Array<string>, key?: string): void {
    this.emit(SocketEnum.JOIN_CHAT, chatId, key);
  }

  public static leave(chatId: string): void {
    this.emit(SocketEnum.LEAVE_CHAT, chatId);
  }

  public static terminate(clearEvent = true): void {
    this.listeners.forEach(({ eventName }) => this.off(eventName));
    this.socket?.disconnect();
    this.socket = null;

    if (clearEvent) {
      this.listeners = [];
      this.emits = [];
    }
  }

  public static status(): ReturnType<typeof io> | null {
    return this.socket;
  }

  public static isConnected(): boolean {
    return !!this.socket?.connected;
  }
}
