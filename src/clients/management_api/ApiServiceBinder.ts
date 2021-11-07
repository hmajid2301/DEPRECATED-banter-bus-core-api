import { interfaces } from 'inversify';
import { TYPES } from '~/container.types';
import { GameService } from './api/game.service';
import { QuestionService } from './api/question.service';
import { StoryService } from './api/story.service';


export class ApiServiceBinder {
    public static with(container: interfaces.Container) {
        container.bind<GameService>(TYPES.GameService).to(GameService).inSingletonScope();
        container.bind<QuestionService>(TYPES.QuestionService).to(QuestionService).inSingletonScope();
        container.bind<StoryService>(TYPES.StoryService).to(StoryService).inSingletonScope();
    }
}
