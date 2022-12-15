import { RequestEvent, RequestHandler } from "@builder.io/qwik-city"
import { User } from "schema/core"
import { v4 as randomUuid } from "uuid"
import { userResource } from "./api"
import { LearnPageSession } from "./routes/learn"

const SESSION_ID_COOKIE = "sid"
const sessionStore: Map<String, XSession> = new Map()

export enum AuthedRedirection {
  "LAST_SECURED",
  "HOME",
}

export const CONFIG = {
  home: "/",
  login: "/login",
  whenRequestsNonAuthed: {
    butAuthed: AuthedRedirection.HOME,
  },
}
export interface Session {
  user: User
  pages: {
    learnPage?: LearnPageSession
  }
}

interface XSession {
  interceptedUrl?: string
  session: Session
}

function getSessionOrFail(requestEvent: RequestEvent) {
  const cookies = requestEvent.request.headers.get("cookie") || ""
  const sessionId = cookies
    .split(";")
    .map(cookie => cookie.trim().split("="))
    .filter(cookieSplit => cookieSplit.length === 2)
    .find(([name]) => name == SESSION_ID_COOKIE)
    ?.at(1)
  if (!sessionId) throw "no session id"

  const session = sessionStore.get(sessionId)
  if (!session) throw "no session"

  return { ...session, sessionId }
}

export interface ActionParams extends RequestEvent {
  redirect: (url: string, reason: string, status?: number) => void
}

export type Action<P, T> = (params: P) => T | Promise<T>

// session aware

export interface SessionAwareActionParams extends ActionParams {
  session?: Session
}

export type SessionAwareAction<T> = Action<SessionAwareActionParams, T>

export function sessionAware(action?: never): RequestHandler<void>
export function sessionAware<T>(
  action: SessionAwareAction<T>
): RequestHandler<T>
export function sessionAware<T>(
  action: SessionAwareAction<T> = (() => {}) as unknown as SessionAwareAction<T>
): RequestHandler<T> {
  return async requestEvent => {
    const redirect = (url: string, reason: any, status?: number) => {
      console.debug("redirect to", url, reason)
      throw requestEvent.response.redirect(url, status)
    }

    let session: Session | undefined = undefined

    try {
      session = getSessionOrFail(requestEvent).session
    } catch (error) {
      session = undefined
    }

    return action({ ...requestEvent, redirect, session })
  }
}

// authed

export interface SessionfulActionParams extends ActionParams {
  session: Session
}

export type AuthedAction<T> = Action<SessionfulActionParams, T>

export function authed(action?: never): RequestHandler<void>
export function authed<T>(action: AuthedAction<T>): RequestHandler<T>
export function authed<T>(
  action: AuthedAction<T> = (() => {}) as unknown as AuthedAction<T>
): RequestHandler<T> {
  return async requestEvent => {
    const redirect = (url: string, reason: any, status?: number) => {
      console.debug("redirect to", url, reason)
      throw requestEvent.response.redirect(url, status)
    }

    let session: Session

    try {
      session = getSessionOrFail(requestEvent).session
    } catch (error) {
      throw redirect(CONFIG.login, error)
    }

    return action({
      ...requestEvent,
      session,
      redirect,
    })
  }
}

// not authed

export type NotAuthedAction<T> = Action<ActionParams, T>

export interface NotAuthedParams {
  whenAuthed?: AuthedRedirection | string
}

export function notAuthed(
  action?: never,
  params?: NotAuthedParams
): RequestHandler<void>
export function notAuthed<T>(
  action: NotAuthedAction<T>,
  params?: NotAuthedParams
): RequestHandler<T>
export function notAuthed<T>(
  action: NotAuthedAction<T> = (() => {}) as unknown as NotAuthedAction<T>,
  params: NotAuthedParams = {}
): RequestHandler<T> {
  return async requestEvent => {
    const redirect = (url: string, reason: string, status?: number) => {
      console.debug("redirect to", url, reason)
      throw requestEvent.response.redirect(url, status)
    }

    let xsession: XSession

    try {
      xsession = getSessionOrFail(requestEvent)
    } catch (error) {
      // actually ok
      return action({
        ...requestEvent,
        redirect,
      })
    }

    const destination = getDestinationAfterAuth(xsession, params.whenAuthed)
    throw redirect(destination, "already authenticated")
  }
}

export interface AuthenticationParams {
  whenServiceUnavailable: string
  whenBadCredentials: string
}

export function authentication(
  params: AuthenticationParams,
  action: AuthedAction<any> = () => {}
): RequestHandler<void> {
  return async requestEvent => {
    const redirect = (url: string, reason: string, status?: number) => {
      console.debug("redirect to", url, reason)
      throw requestEvent.response.redirect(url, status)
    }

    const form = await requestEvent.request.formData()
    console.debug("trying to authenticate /w", form)

    let user: User

    try {
      user = await userResource
        .userAuthPost({
          handle: form.get("handle") as string,
          password: form.get("password") as string,
        })
        .then(response => response.data)
    } catch (error) {
      throw redirect(
        params.whenServiceUnavailable,
        "service unavailable: " + error
      )
    }

    if (!user) throw redirect(params.whenBadCredentials, "bad credentials")

    console.debug("authenticated")

    const xsession: XSession = {
      session: {
        user,
        pages: {},
      },
    }

    const sessionId = randomUuid()
    sessionStore.set(sessionId, xsession)

    requestEvent.response.headers.set(
      "Set-Cookie",
      SESSION_ID_COOKIE + "=" + sessionId + "; Path=/; SameSite=Strict"
    )

    await action({
      ...requestEvent,
      session: xsession.session,
      redirect,
    })

    throw redirect(
      getDestinationAfterAuth(xsession),
      "successful authentication (auth)"
    )
  }
}

export interface DeauthParams {
  withSession?: (session: Session) => any
  afterDeauth?: NotAuthedAction<any>
}

export function deauth(params: DeauthParams = {}): RequestHandler<void> {
  return async requestEvent => {
    const redirect = (url: string, reason: string, status?: number) => {
      console.debug("redirect to", url, reason)
      throw requestEvent.response.redirect(url, status)
    }

    try {
      const session = getSessionOrFail(requestEvent)
      sessionStore.delete(session.sessionId)
      ;(params.withSession || (() => {}))(session.session)
    } catch (error) {
      console.debug("trying to deauth while wasn't even authed")
    }

    await (params.afterDeauth || (() => {}))({
      ...requestEvent,
      redirect,
    })

    throw redirect(CONFIG.login, "logged out")
  }
}

function getDestinationAfterAuth(
  session: XSession,
  action: string | AuthedRedirection = CONFIG.whenRequestsNonAuthed.butAuthed
) {
  switch (action) {
    case AuthedRedirection.HOME:
      return CONFIG.home
    case AuthedRedirection.LAST_SECURED:
      return session.interceptedUrl || CONFIG.home
    default:
      return action.startsWith("/") ? action : CONFIG.home
  }
}
