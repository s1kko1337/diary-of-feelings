в чоо# BUG 1. Генерация некорректного формата тела запроса при попытке создать запись в кпт дневник по адресу /emotions

PAYLOAD

```
{
"emotion": "happiness",
"emotionCategory": "joy",
"intensity": 5,
"note": "fsddfsdsfsd",
"isTimeCapsule": false
}
```

```
SERVER RESPONSE:
{
"detail": [
{
"type": "missing",
"loc": [
"body",
"emotion_category"
],
"msg": "Field required",
"input": {
"emotion": "happiness",
"emotionCategory": "joy",
"intensity": 5,
"note": "fsddfsdsfsd",
"isTimeCapsule": false
}
},
{
"type": "missing",
"loc": [
"body",
"emotion_name"
],
"msg": "Field required",
"input": {
"emotion": "happiness",
"emotionCategory": "joy",
"intensity": 5,
"note": "fsddfsdsfsd",
"isTimeCapsule": false
}
}
]
}
```

# BUG 2: Невозможность отправки сообщений в чат с ассистентом.

PAYLOAD:


http://localhost:8000/api/assistant/chat

Request Method

POST

Status Code

500 Internal Server Error

Referrer Policy

strict-origin-when-cross-origin

{
"content": "Я не знаю почему у меня плохое состояние"
}

STACKTRACE:

2026-03-09 20:31:35,607 app.main ERROR Unhandled error on POST /api/assistant/chat
backend-1  | Traceback (most recent call last):
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 526, in _prepare_and_execute
backend-1  |     prepared_stmt, attributes = await adapt_connection._prepare(
backend-1  |                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 773, in _prepare
backend-1  |     prepared_stmt = await self._connection.prepare(
backend-1  |                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/asyncpg/connection.py", line 638, in prepare
backend-1  |     return await self._prepare(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/asyncpg/connection.py", line 657, in _prepare
backend-1  |     stmt = await self._get_statement(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/asyncpg/connection.py", line 443, in _get_statement
backend-1  |     statement = await self._protocol.prepare(
backend-1  |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "asyncpg/protocol/protocol.pyx", line 165, in prepare
backend-1  | asyncpg.exceptions.UndefinedColumnError: column user_portraits.note_themes does not exist
backend-1  |
backend-1  | The above exception was the direct cause of the following exception:
backend-1  |
backend-1  | Traceback (most recent call last):
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1967, in _exec_single_context
backend-1  |     self.dialect.do_execute(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/default.py", line 952, in do_execute
backend-1  |     cursor.execute(statement, parameters)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 585, in execute
backend-1  |     self._adapt_connection.await_(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 132, in await_only
backend-1  |     return current.parent.switch(awaitable)  # type: ignore[no-any-return,attr-defined] # noqa: E501
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 196, in greenlet_spawn
backend-1  | INFO:     172.19.0.1:39854 - "POST /api/assistant/chat HTTP/1.1" 500 Internal Server Error
backend-1  |     value = await result
backend-1  |             ^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 563, in _prepare_and_execute
backend-1  |     self._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 513, in _handle_exception
backend-1  |     self._adapt_connection._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 797, in _handle_exception
backend-1  |     raise translated_error from error
backend-1  | sqlalchemy.dialects.postgresql.asyncpg.AsyncAdapt_asyncpg_dbapi.ProgrammingError: <class 'asyncpg.exceptions.UndefinedColumnError'>: column user_portraits.note_themes does not exist
backend-1  |
backend-1  | The above exception was the direct cause of the following exception:
backend-1  |
backend-1  | Traceback (most recent call last):
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/errors.py", line 164, in __call__
backend-1  |     await self.app(scope, receive, _send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 191, in __call__
backend-1  |     with recv_stream, send_stream, collapse_excgroups():
backend-1  |                                    ^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/contextlib.py", line 158, in __exit__
backend-1  |     self.gen.throw(value)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 193, in __call__
backend-1  |     response = await self.dispatch_func(request, call_next)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/middleware/logging.py", line 13, in dispatch
backend-1  |     response = await call_next(request)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 168, in call_next
backend-1  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 144, in coro
backend-1  |     await self.app(scope, receive_or_disconnect, send_no_error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 191, in __call__
backend-1  |     with recv_stream, send_stream, collapse_excgroups():
backend-1  |                                    ^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/contextlib.py", line 158, in __exit__
backend-1  |     self.gen.throw(value)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 193, in __call__
backend-1  |     response = await self.dispatch_func(request, call_next)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/middleware/security.py", line 8, in dispatch
backend-1  |     response = await call_next(request)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 168, in call_next
backend-1  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 144, in coro
backend-1  |     await self.app(scope, receive_or_disconnect, send_no_error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/cors.py", line 95, in __call__
backend-1  |     await self.simple_response(scope, receive, send, request_headers=headers)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/cors.py", line 153, in simple_response
backend-1  |     await self.app(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/exceptions.py", line 63, in __call__
backend-1  |     await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
backend-1  |     await app(scope, receive, sender)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/middleware/asyncexitstack.py", line 18, in __call__
backend-1  |     await self.app(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/routing.py", line 716, in __call__
backend-1  |     await self.middleware_stack(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/routing.py", line 736, in app
backend-1  |     await route.handle(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/routing.py", line 290, in handle
backend-1  |     await self.app(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 130, in app
backend-1  |     await wrap_app_handling_exceptions(app, request)(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
backend-1  |     await app(scope, receive, sender)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 116, in app
backend-1  |     response = await f(request)
backend-1  |                ^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 670, in app
backend-1  |     raw_response = await run_endpoint_function(
backend-1  |                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 324, in run_endpoint_function
backend-1  |     return await dependant.call(**values)
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/routers/assistant.py", line 28, in chat
backend-1  |     context = await build_user_context(db, current_user.id)
backend-1  |               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/services/context_builder.py", line 112, in build_user_context
backend-1  |     portrait = await get_portrait(db, user_id)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/services/portrait.py", line 182, in get_portrait
backend-1  |     result = await db.execute(
backend-1  |              ^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/ext/asyncio/session.py", line 449, in execute
backend-1  |     result = await greenlet_spawn(
backend-1  |              ^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 201, in greenlet_spawn
backend-1  |     result = context.throw(*sys.exc_info())
backend-1  |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/orm/session.py", line 2351, in execute
backend-1  |     return self._execute_internal(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/orm/session.py", line 2249, in _execute_internal
backend-1  |     result: Result[Any] = compile_state_cls.orm_execute_statement(
backend-1  |                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/orm/context.py", line 306, in orm_execute_statement
backend-1  |     result = conn.execute(
backend-1  |              ^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1419, in execute
backend-1  |     return meth(
backend-1  |            ^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/sql/elements.py", line 527, in _execute_on_connection
backend-1  |     return connection._execute_clauseelement(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1641, in _execute_clauseelement
backend-1  |     ret = self._execute_context(
backend-1  |           ^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1846, in _execute_context
backend-1  |     return self._exec_single_context(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1986, in _exec_single_context
backend-1  |     self._handle_dbapi_exception(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 2363, in _handle_dbapi_exception
backend-1  |     raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1967, in _exec_single_context
backend-1  |     self.dialect.do_execute(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/default.py", line 952, in do_execute
backend-1  |     cursor.execute(statement, parameters)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 585, in execute
backend-1  |     self._adapt_connection.await_(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 132, in await_only
backend-1  |     return current.parent.switch(awaitable)  # type: ignore[no-any-return,attr-defined] # noqa: E501
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 196, in greenlet_spawn
backend-1  |     value = await result
backend-1  |             ^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 563, in _prepare_and_execute
backend-1  |     self._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 513, in _handle_exception
backend-1  |     self._adapt_connection._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 797, in _handle_exception
backend-1  |     raise translated_error from error
backend-1  | sqlalchemy.exc.ProgrammingError: (sqlalchemy.dialects.postgresql.asyncpg.ProgrammingError) <class 'asyncpg.exceptions.UndefinedColumnError'>: column user_portraits.note_themes does not exist
backend-1  | [SQL: SELECT user_portraits.id, user_portraits.user_id, user_portraits.dominant_emotion, user_portraits.dominant_category, user_portraits.mood_trend, user_portraits.stress_level, user_portraits.productivity_rate, user_portraits.top_distortions, user_portraits.active_themes, user_portraits.emotion_counts, user_portraits.note_themes, user_portraits.data_quality, user_portraits.computed_at, user_portraits.created_at, user_portraits.updated_at
backend-1  | FROM user_portraits
backend-1  | WHERE user_portraits.user_id = $1::UUID]
backend-1  | [parameters: (UUID('3f0d5b73-f7d9-4da4-a8e6-7c46d85eb9ec'),)]
backend-1  | (Background on this error at: https://sqlalche.me/e/20/f405)
backend-1  | ERROR:    Exception in ASGI application
backend-1  | Traceback (most recent call last):
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 526, in _prepare_and_execute
backend-1  |     prepared_stmt, attributes = await adapt_connection._prepare(
backend-1  |                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 773, in _prepare
backend-1  |     prepared_stmt = await self._connection.prepare(
backend-1  |                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/asyncpg/connection.py", line 638, in prepare
backend-1  |     return await self._prepare(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/asyncpg/connection.py", line 657, in _prepare
backend-1  |     stmt = await self._get_statement(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/asyncpg/connection.py", line 443, in _get_statement
backend-1  |     statement = await self._protocol.prepare(
backend-1  |                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "asyncpg/protocol/protocol.pyx", line 165, in prepare
backend-1  | asyncpg.exceptions.UndefinedColumnError: column user_portraits.note_themes does not exist
backend-1  |
backend-1  | The above exception was the direct cause of the following exception:
backend-1  |
backend-1  | Traceback (most recent call last):
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1967, in _exec_single_context
backend-1  |     self.dialect.do_execute(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/default.py", line 952, in do_execute
backend-1  |     cursor.execute(statement, parameters)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 585, in execute
backend-1  |     self._adapt_connection.await_(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 132, in await_only
backend-1  |     return current.parent.switch(awaitable)  # type: ignore[no-any-return,attr-defined] # noqa: E501
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 196, in greenlet_spawn
backend-1  |     value = await result
backend-1  |             ^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 563, in _prepare_and_execute
backend-1  |     self._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 513, in _handle_exception
backend-1  |     self._adapt_connection._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 797, in _handle_exception
backend-1  |     raise translated_error from error
backend-1  | sqlalchemy.dialects.postgresql.asyncpg.AsyncAdapt_asyncpg_dbapi.ProgrammingError: <class 'asyncpg.exceptions.UndefinedColumnError'>: column user_portraits.note_themes does not exist
backend-1  |
backend-1  | The above exception was the direct cause of the following exception:
backend-1  |
backend-1  | Traceback (most recent call last):
backend-1  |   File "/usr/local/lib/python3.12/site-packages/uvicorn/protocols/http/httptools_impl.py", line 416, in run_asgi
backend-1  |     result = await app(  # type: ignore[func-returns-value]
backend-1  |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/uvicorn/middleware/proxy_headers.py", line 60, in __call__
backend-1  |     return await self.app(scope, receive, send)
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/applications.py", line 1160, in __call__
backend-1  |     await super().__call__(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/applications.py", line 107, in __call__
backend-1  |     await self.middleware_stack(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/errors.py", line 186, in __call__
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/errors.py", line 164, in __call__
backend-1  |     await self.app(scope, receive, _send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 191, in __call__
backend-1  |     with recv_stream, send_stream, collapse_excgroups():
backend-1  |                                    ^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/contextlib.py", line 158, in __exit__
backend-1  |     self.gen.throw(value)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 193, in __call__
backend-1  |     response = await self.dispatch_func(request, call_next)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/middleware/logging.py", line 13, in dispatch
backend-1  |     response = await call_next(request)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 168, in call_next
backend-1  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 144, in coro
backend-1  |     await self.app(scope, receive_or_disconnect, send_no_error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 191, in __call__
backend-1  |     with recv_stream, send_stream, collapse_excgroups():
backend-1  |                                    ^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/contextlib.py", line 158, in __exit__
backend-1  |     self.gen.throw(value)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_utils.py", line 87, in collapse_excgroups
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 193, in __call__
backend-1  |     response = await self.dispatch_func(request, call_next)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/middleware/security.py", line 8, in dispatch
backend-1  |     response = await call_next(request)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 168, in call_next
backend-1  |     raise app_exc from app_exc.__cause__ or app_exc.__context__
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/base.py", line 144, in coro
backend-1  |     await self.app(scope, receive_or_disconnect, send_no_error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/cors.py", line 95, in __call__
backend-1  |     await self.simple_response(scope, receive, send, request_headers=headers)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/cors.py", line 153, in simple_response
backend-1  |     await self.app(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/middleware/exceptions.py", line 63, in __call__
backend-1  |     await wrap_app_handling_exceptions(self.app, conn)(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
backend-1  |     await app(scope, receive, sender)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/middleware/asyncexitstack.py", line 18, in __call__
backend-1  |     await self.app(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/routing.py", line 716, in __call__
backend-1  |     await self.middleware_stack(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/routing.py", line 736, in app
backend-1  |     await route.handle(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/routing.py", line 290, in handle
backend-1  |     await self.app(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 130, in app
backend-1  |     await wrap_app_handling_exceptions(app, request)(scope, receive, send)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 53, in wrapped_app
backend-1  |     raise exc
backend-1  |   File "/usr/local/lib/python3.12/site-packages/starlette/_exception_handler.py", line 42, in wrapped_app
backend-1  |     await app(scope, receive, sender)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 116, in app
backend-1  |     response = await f(request)
backend-1  |                ^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 670, in app
backend-1  |     raw_response = await run_endpoint_function(
backend-1  |                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/fastapi/routing.py", line 324, in run_endpoint_function
backend-1  |     return await dependant.call(**values)
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/routers/assistant.py", line 28, in chat
backend-1  |     context = await build_user_context(db, current_user.id)
backend-1  |               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/services/context_builder.py", line 112, in build_user_context
backend-1  |     portrait = await get_portrait(db, user_id)
backend-1  |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/app/app/services/portrait.py", line 182, in get_portrait
backend-1  |     result = await db.execute(
backend-1  |              ^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/ext/asyncio/session.py", line 449, in execute
backend-1  |     result = await greenlet_spawn(
backend-1  |              ^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 201, in greenlet_spawn
backend-1  |     result = context.throw(*sys.exc_info())
backend-1  |              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/orm/session.py", line 2351, in execute
backend-1  |     return self._execute_internal(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/orm/session.py", line 2249, in _execute_internal
backend-1  |     result: Result[Any] = compile_state_cls.orm_execute_statement(
backend-1  |                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/orm/context.py", line 306, in orm_execute_statement
backend-1  |     result = conn.execute(
backend-1  |              ^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1419, in execute
backend-1  |     return meth(
backend-1  |            ^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/sql/elements.py", line 527, in _execute_on_connection
backend-1  |     return connection._execute_clauseelement(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1641, in _execute_clauseelement
backend-1  |     ret = self._execute_context(
backend-1  |           ^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1846, in _execute_context
backend-1  |     return self._exec_single_context(
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1986, in _exec_single_context
backend-1  |     self._handle_dbapi_exception(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 2363, in _handle_dbapi_exception
backend-1  |     raise sqlalchemy_exception.with_traceback(exc_info[2]) from e
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/base.py", line 1967, in _exec_single_context
backend-1  |     self.dialect.do_execute(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/engine/default.py", line 952, in do_execute
backend-1  |     cursor.execute(statement, parameters)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 585, in execute
backend-1  |     self._adapt_connection.await_(
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 132, in await_only
backend-1  |     return current.parent.switch(awaitable)  # type: ignore[no-any-return,attr-defined] # noqa: E501
backend-1  |            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 196, in greenlet_spawn
backend-1  |     value = await result
backend-1  |             ^^^^^^^^^^^^
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 563, in _prepare_and_execute
backend-1  |     self._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 513, in _handle_exception
backend-1  |     self._adapt_connection._handle_exception(error)
backend-1  |   File "/usr/local/lib/python3.12/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 797, in _handle_exception
backend-1  |     raise translated_error from error
backend-1  | sqlalchemy.exc.ProgrammingError: (sqlalchemy.dialects.postgresql.asyncpg.ProgrammingError) <class 'asyncpg.exceptions.UndefinedColumnError'>: column user_portraits.note_themes does not exist
backend-1  | [SQL: SELECT user_portraits.id, user_portraits.user_id, user_portraits.dominant_emotion, user_portraits.dominant_category, user_portraits.mood_trend, user_portraits.stress_level, user_portraits.productivity_rate, user_portraits.top_distortions, user_portraits.active_themes, user_portraits.emotion_counts, user_portraits.note_themes, user_portraits.data_quality, user_portraits.computed_at, user_portraits.created_at, user_portraits.updated_at
backend-1  | FROM user_portraits
backend-1  | WHERE user_portraits.user_id = $1::UUID]
backend-1  | [parameters: (UUID('3f0d5b73-f7d9-4da4-a8e6-7c46d85eb9ec'),)]
backend-1  | (Background on this error at: https://sqlalche.me/e/20/f405)
