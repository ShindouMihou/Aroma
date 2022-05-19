/// <reference types="@sveltejs/kit" />

import type { User } from "$lib/types/user";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		user: User
	}
	// interface Platform {}
	interface Session {
		user: string
	}
	// interface Stuff {}
}
