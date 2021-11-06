import {interfaces} from 'inversify';

import { GameService } from './api/game.service';
import { QuestionService } from './api/question.service';
import { StoryService } from './api/story.service';

export class ApiServiceBinder {
    public static with(container: interfaces.Container) {
        container.bind<GameService>('GameService').to(GameService).inSingletonScope();
        container.bind<QuestionService>('QuestionService').to(QuestionService).inSingletonScope();
        container.bind<StoryService>('StoryService').to(StoryService).inSingletonScope();
    }
}
