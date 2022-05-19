/// <reference types="@sveltejs/kit" />

import type Account from "$lib/models/user";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	declare namespace App {
		interface Locals {
			user: Account | null | undefined
		}
		// interface Platform {}
		interface Session {
			user: string
		}
		// interface Stuff {}
	}
	
}