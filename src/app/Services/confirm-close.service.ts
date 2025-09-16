import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmCloseService {

  constructor() { }

  private inputStates = new Map<string, { initial: string, current: string }>();
  formChangedSubject = new BehaviorSubject<boolean>(false);

    registerInput(id: string, initialValue: string) {
        this.inputStates.set(id, { initial: initialValue, current: initialValue });
    }

    updateInput(id: string, currentValue: string) {
        const input = this.inputStates.get(id);
        if (input) {
            input.current = currentValue;
            this.checkFormChanged();
        }
    }

    private checkFormChanged() {
        let isChanged = false;
        for (const { initial, current } of this.inputStates.values()) {
            if (initial !== current) {
                isChanged = true;
                break;
            }
        }
        console.log(isChanged);
        this.formChangedSubject.next(isChanged);
    }
}
