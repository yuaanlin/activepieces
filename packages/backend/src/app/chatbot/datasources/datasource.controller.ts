import { CreateDataSourceRequest } from '@activepieces/shared'
import {
    FastifyPluginCallbackTypebox,
    Type,
} from '@fastify/type-provider-typebox'
import { chatbotService } from '../chatbot.service'

const ChatBotIdParams = Type.Object({
    id: Type.String(),
})

export const datasourceController: FastifyPluginCallbackTypebox = (
    app,
    _opts,
    done,
) => {

    app.post(
        '/:id/datasources',
        {
            schema: {
                params: ChatBotIdParams,
                body: CreateDataSourceRequest,
            },
        },
        async (request) => {
            return chatbotService.createDatasource({
                projectId: request.principal.projectId,
                chatbotId: request.params.id,
                request: request.body,
            })
        },
    ),
    app.delete(
        '/:id/datasources/:datasourceId',
        {
            schema: {
                params: Type.Object({
                    id: Type.String(),
                    datasourceId: Type.String(),
                }),
            },
        },
        async (request) => {
            return chatbotService.deleteDatasource({
                projectId: request.principal.projectId,
                chatbotId: request.params.id,
                dataSourceId: request.params.datasourceId,
            })
        },
    ),

    done()
}