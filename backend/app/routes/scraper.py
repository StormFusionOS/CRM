from fastapi import APIRouter, HTTPException
from typing import Any, Dict, List, Optional

router = APIRouter()

_targets: List[Dict[str, Any]] = [
    {
        "id": "t-1",
        "domain": "rivercityclean.com",
        "tags": ["citations", "mentions"],
        "status": "enabled",
        "robots": "ok",
        "lastScrapeAt": "2024-03-08T07:15:00Z",
        "nextRunAt": "2024-03-08T13:00:00Z",
        "depth": 2,
        "cadence": "0 */6 * * *",
        "renderBudget": 30,
        "notes": "Primary brand domain",
    }
]

_schedules: List[Dict[str, Any]] = [
    {
        "id": "s-1",
        "code": "CITATIONS_DELTA_DAILY",
        "cron": "15 3 * * *",
        "description": "Citations delta monitor",
        "enabled": True,
        "lastRunAt": "2024-03-07T03:15:00Z",
        "nextRunAt": "2024-03-08T03:15:00Z",
    }
]

_jobs: Dict[str, Dict[str, Any]] = {
    "job-1001": {
        "id": "job-1001",
        "type": "SERP_SAMPLER",
        "domain": "rivercityclean.com",
        "startedAt": "2024-03-08T07:45:00Z",
        "durationMs": 42000,
        "status": "running",
        "parameters": {"location": "US", "depth": 3},
        "artifacts": [],
        "logs": ["[07:45:00] starting job"],
    }
}

_config: Dict[str, Any] = {
    "proxies": ["http://user:pass@proxy-1.local:8080"],
    "userAgents": ["Mozilla/5.0"],
    "rateLimits": [{"resource": "global", "limit": 60, "windowSeconds": 60}],
    "renderBudget": 50,
    "quarantineWindows": {"ROBOTS_DISALLOWED": 1440},
}

_logs: List[Dict[str, Any]] = [
    {
        "id": "log-1",
        "level": "INFO",
        "message": "Scraper started",
        "timestamp": "2024-03-08T07:00:00Z",
        "domain": "rivercityclean.com",
        "jobId": "job-1001",
    }
]

_snapshots: Dict[str, Dict[str, Any]] = {
    "snap-1": {
        "id": "snap-1",
        "domain": "rivercityclean.com",
        "path": "/",
        "sizeKb": 320,
        "capturedAt": "2024-03-07T10:00:00Z",
        "screenshotUrl": "https://placehold.co/800x600",
        "html": "<html><body><h1>Home</h1></body></html>",
    }
}

_quarantine: List[Dict[str, Any]] = [
    {
        "domain": "captcha-blocked.test",
        "reason": "CAPTCHA_DETECTED",
        "untilDate": "2024-03-10T00:00:00Z",
    }
]


@router.get("/scraper/dashboard")
async def scraper_dashboard():
    return {
        "trackedDomains": len(_targets),
        "activeJobs": 1,
        "lastRun": {"status": "success", "timestamp": "2024-03-08T07:40:00Z"},
        "queueDepth": 2,
        "recentEvents": [
            {
                "id": "evt-1",
                "domain": "rivercityclean.com",
                "jobType": "SERP_SAMPLER",
                "status": "success",
                "timestamp": "2024-03-08T07:40:00Z",
            }
        ],
    }


@router.get("/scraper/targets")
async def list_targets():
    return _targets


@router.post("/scraper/targets")
async def create_target(payload: Dict[str, Any]):
    new_target = {
        "id": f"t-{len(_targets) + 1}",
        **payload,
        "status": payload.get("status", "enabled"),
        "robots": payload.get("robots", "ok"),
        "lastScrapeAt": None,
        "nextRunAt": None,
    }
    _targets.append(new_target)
    return new_target


@router.patch("/scraper/targets/{target_id}")
async def update_target(target_id: str, payload: Dict[str, Any]):
    for target in _targets:
        if target["id"] == target_id:
            target.update(payload)
            return target
    raise HTTPException(status_code=404, detail="Target not found")


@router.post("/scraper/targets/{target_id}/run")
async def run_target(target_id: str):
    return {"accepted": True, "targetId": target_id}


@router.get("/scraper/schedules")
async def list_schedules():
    return _schedules


@router.patch("/scraper/schedules/{schedule_id}")
async def update_schedule(schedule_id: str, payload: Dict[str, Any]):
    for schedule in _schedules:
        if schedule["id"] == schedule_id:
            schedule.update(payload)
            return schedule
    raise HTTPException(status_code=404, detail="Schedule not found")


@router.post("/scraper/schedules/{schedule_id}/run")
async def run_schedule(schedule_id: str):
    return {"accepted": True, "scheduleId": schedule_id}


@router.get("/scraper/jobs")
async def list_jobs(status: Optional[str] = None):
    if status:
        return [job for job in _jobs.values() if job["status"] == status]
    return list(_jobs.values())


@router.get("/scraper/jobs/{job_id}")
async def get_job(job_id: str):
    job = _jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.post("/scraper/jobs/{job_id}/retry")
async def retry_job(job_id: str):
    return {"accepted": True, "jobId": job_id}


@router.post("/scraper/jobs/{job_id}/cancel")
async def cancel_job(job_id: str):
    return {"accepted": True, "jobId": job_id}


@router.get("/scraper/config")
async def get_config():
    return _config


@router.post("/scraper/config")
async def update_config(payload: Dict[str, Any]):
    _config.update(payload)
    return _config


@router.get("/scraper/logs")
async def get_logs():
    return {"items": _logs, "cursor": "cursor-123"}


@router.get("/scraper/snapshots")
async def list_snapshots():
    return list(_snapshots.values())


@router.get("/scraper/snapshots/{snapshot_id}")
async def get_snapshot(snapshot_id: str):
    snapshot = _snapshots.get(snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return snapshot


@router.get("/scraper/snapshots/diff")
async def snapshot_diff(a: str, b: str):
    return {"baseId": a, "compareId": b, "diffText": f"--- {a}\n+++ {b}\n-<html/>\n+<html/>"}


@router.get("/scraper/quarantine")
async def list_quarantine():
    return _quarantine


@router.post("/scraper/quarantine/release")
async def release_domain(payload: Dict[str, str]):
    global _quarantine
    _quarantine = [entry for entry in _quarantine if entry["domain"] != payload.get("domain")]
    return {"success": True}


@router.post("/scraper/quarantine/extend")
async def extend_quarantine(payload: Dict[str, str]):
    return {"success": True, "domain": payload.get("domain")}
