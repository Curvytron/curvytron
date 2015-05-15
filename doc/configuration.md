## Configuration

To setup a custom configuration, duplicate `config.json.sample` to `config.json`:

    cp config.json.sample config.json

Details of `config.json`:

```json
{
    "port": 8080,
    "googleAnalyticsId": null,
    "inspector": {
        "enabled": false,
        "host": "127.0.0.1",
        "port": 8086,
        "username": "root",
        "password": "root",
        "database": "curvytron"
    }
}
```

## Configuration reference

| Variable | Description | Default value | Type | Required |
| -------- | ----------- | ------------- | ---- | -------- |
| port | The port on which Curvytron server will run | 8080 | Number | Required |
| googleAnalyticsId | Google Analytics Identifier | null | String | Optional |

__Inspector:__

The inspector watch the server to provides statistics like:
* Total of played games
* Number of players per game
* Game duration
* CPU / Memory usage of the server
* ...

| Variable | Description | Default value | Type | Required |
| -------- | ----------- | ------------- | ---- | -------- |
| enabled | Enable/Disable the Inspector | false | Boolean | Required |
| host | InfluxDb host | 127.0.0.1 | String | Required |
| port | InfluxDb port | 8086 | Number | Required |
| username | InfluxDb username | root | String | Required |
| password | InfluxDb password | root | String | Required |
| database | InfluxDb database | curvytorn | String | Required |
