import { MessageManager } from "./MessageManager";
import { ExpManager } from "./ExpManager";

export type ManageableObjects = ExpManager | MessageManager;

export class ObjectManager {
  private static instance: ObjectManager = new ObjectManager();
  private objects: Map<string, ManageableObjects>;

  private constructor() {
    this.objects = new Map<string, ManageableObjects>();
  }

  public static getInstance(): ObjectManager {
    return this.instance;
  }

  public registerObjectIfNotExists(
    name: string,
    object: ManageableObjects
  ): void {
    if (!this.objects.has(name)) {
      this.objects.set(name, object);
    }
  }

  public registerObject(name: string, object: ManageableObjects): void {
    this.objects.set(name, object);
  }

  public getObject(name: string): ManageableObjects | undefined {
    return this.objects.get(name);
  }
}
