from datetime import datetime,timezone

def generate_log_id():
    ts = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%S-%f")[:-3]
    return f"LOG-{ts}"
