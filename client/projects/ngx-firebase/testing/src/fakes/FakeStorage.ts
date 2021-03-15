// import { StorageService } from '@mal/shared';
declare type StorageService = FakeStorage;

export class FakeStorage {

    uploadImage: jasmine.Spy<(name: string) => Promise<any>> = jasmine.createSpy('uploadImage');

    constructor() {
    }

    static create(): FakeStorage & StorageService {
        return new FakeStorage() as any as FakeStorage & StorageService;
    }

}
