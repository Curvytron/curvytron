## Configuration

To setup a custom configuration, duplicate `config.json.sample` to `config.json`:

    cp config.json.sample config.json

## Configuration reference

Details of `config.json`:

```
{
    # The port on wich Curvytron server will run
    "port": 8080,

    # Optional Google Analytocs Identifier
    "googleAnalyticsId": null,

    # Inspector (InfluxDb statistics):
    "inspector": {
        "enabled": false,
        # InfluxDb configuration:
        "host": "127.0.0.1",
        "port": 8086,
        "username": "root",
        "password": "root",
        "database": "curvytron"
    }
}
```
