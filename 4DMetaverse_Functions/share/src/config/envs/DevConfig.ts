export default {
    function: {
        version: '0.1.0',
        location: 'us-central1',
        vpc_connector_name: 'vpc-connector',
        base_url: 'https://us-central1-four-d-metaverse-dev.cloudfunctions.net'
    },
    system: {
        timeZone: 'Asia/Taipei'
    },
    app: {
        support_version: ['0.1.0']
    },
    redis: {
        token_cache: 0,
        verify_code_cache: 1
    }
}