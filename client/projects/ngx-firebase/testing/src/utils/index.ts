export * from './patchConsole';
import { ComponentFixture } from '@angular/core/testing';
import { patchConsole } from './patchConsole';

export async function commonPre() {
    patchConsole();
}

export async function commonPost<T>(component: ComponentFixture<T>) {
}

export async function commonTeardown<T>(component: ComponentFixture<T>) {
}
