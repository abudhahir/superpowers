export class StateManager {
    constructor(statePath: string);
    statePath: string;
    defaultState: {
        session: {
            id: null;
            activeSkill: null;
        };
        workflow: {
            currentStep: string;
            stepIndex: number;
            completedSteps: any[];
            context: {};
        };
        agents: {
            active: any[];
            overrides: {};
        };
    };
    load(): Promise<any>;
    update(partialState: any): Promise<any>;
}
