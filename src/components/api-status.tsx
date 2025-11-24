'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { CheckCircle, XCircle, Loader } from '@untitledui/icons';

interface ApiStatus {
    isReachable: boolean;
    isLoading: boolean;
    message: string;
}

/**
 * API Status Indicator Component
 *
 * Shows whether the API server is reachable and responding.
 * Useful for debugging and confirming the backend is running.
 *
 * Usage:
 * <ApiStatus />
 */
export function ApiStatus() {
    const [status, setStatus] = useState<ApiStatus>({
        isReachable: false,
        isLoading: true,
        message: 'Checking API connection...',
    });

    useEffect(() => {
        checkApiStatus();
        const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
        return () => clearInterval(interval);
    }, []);

    async function checkApiStatus() {
        setStatus(prev => ({ ...prev, isLoading: true }));

        try {
            const result = await apiClient.healthCheck();

            if (result.status === 'ok') {
                setStatus({
                    isReachable: true,
                    isLoading: false,
                    message: `API connected (${result.environment})`,
                });
            } else {
                setStatus({
                    isReachable: false,
                    isLoading: false,
                    message: 'API returned unexpected response',
                });
            }
        } catch (error) {
            setStatus({
                isReachable: false,
                isLoading: false,
                message: 'API not reachable - Is the server running on port 5000?',
            });
        }
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    backdrop-blur-xl border shadow-lg
                    ${
                        status.isReachable
                            ? 'bg-green-900/60 border-green-500/20 text-green-100'
                            : 'bg-red-900/60 border-red-500/20 text-red-100'
                    }
                `}
            >
                {status.isLoading ? (
                    <Loader className="h-4 w-4 animate-spin" />
                ) : status.isReachable ? (
                    <CheckCircle className="h-4 w-4" />
                ) : (
                    <XCircle className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{status.message}</span>
            </div>
        </div>
    );
}

/**
 * Detailed API Status Component (for debugging)
 *
 * Shows more detailed information about the API connection.
 *
 * Usage:
 * <DetailedApiStatus />
 */
export function DetailedApiStatus() {
    const [status, setStatus] = useState<{
        health: any;
        auth: 'not-checked' | 'working' | 'error';
        database: 'not-checked' | 'working' | 'error';
        error?: string;
    }>({
        health: null,
        auth: 'not-checked',
        database: 'not-checked',
    });

    useEffect(() => {
        checkStatus();
    }, []);

    async function checkStatus() {
        try {
            // Check health endpoint
            const health = await apiClient.healthCheck();
            setStatus(prev => ({ ...prev, health }));

            // Try to check if database is working by attempting auth (will fail but gives us info)
            try {
                await apiClient.login({ email: 'test@test.com', password: 'test' });
            } catch (error: any) {
                // If we get a 401 "Invalid email or password", database is working
                // If we get connection error, database is not working
                if (error.message?.includes('Invalid email or password')) {
                    setStatus(prev => ({ ...prev, database: 'working', auth: 'working' }));
                } else {
                    setStatus(prev => ({
                        ...prev,
                        database: 'error',
                        error: error.message,
                    }));
                }
            }
        } catch (error: any) {
            setStatus(prev => ({
                ...prev,
                error: error.message || 'Failed to connect to API',
            }));
        }
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">API Status</h2>

                <div className="space-y-4">
                    {/* Health Check */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300">Health Endpoint:</span>
                        <span
                            className={
                                status.health
                                    ? 'text-green-400 flex items-center gap-2'
                                    : 'text-red-400 flex items-center gap-2'
                            }
                        >
                            {status.health ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Connected
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4" />
                                    Not Reachable
                                </>
                            )}
                        </span>
                    </div>

                    {status.health && (
                        <div className="text-sm text-slate-400 pl-4">
                            Environment: {status.health.environment}
                        </div>
                    )}

                    {/* Database Check */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300">Database:</span>
                        <span
                            className={
                                status.database === 'working'
                                    ? 'text-green-400 flex items-center gap-2'
                                    : status.database === 'error'
                                    ? 'text-red-400 flex items-center gap-2'
                                    : 'text-slate-400 flex items-center gap-2'
                            }
                        >
                            {status.database === 'working' ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Connected
                                </>
                            ) : status.database === 'error' ? (
                                <>
                                    <XCircle className="h-4 w-4" />
                                    Not Connected
                                </>
                            ) : (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Checking...
                                </>
                            )}
                        </span>
                    </div>

                    {/* Auth Check */}
                    <div className="flex items-center justify-between">
                        <span className="text-slate-300">Auth Endpoints:</span>
                        <span
                            className={
                                status.auth === 'working'
                                    ? 'text-green-400 flex items-center gap-2'
                                    : status.auth === 'error'
                                    ? 'text-red-400 flex items-center gap-2'
                                    : 'text-slate-400 flex items-center gap-2'
                            }
                        >
                            {status.auth === 'working' ? (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Working
                                </>
                            ) : status.auth === 'error' ? (
                                <>
                                    <XCircle className="h-4 w-4" />
                                    Error
                                </>
                            ) : (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Checking...
                                </>
                            )}
                        </span>
                    </div>

                    {/* Error Display */}
                    {status.error && (
                        <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded text-red-300 text-sm">
                            <strong>Error:</strong> {status.error}
                        </div>
                    )}

                    {/* Setup Instructions */}
                    {!status.health && (
                        <div className="mt-4 p-4 bg-blue-900/20 border border-blue-500/20 rounded text-blue-300 text-sm">
                            <strong>Setup Required:</strong>
                            <ol className="list-decimal list-inside mt-2 space-y-1">
                                <li>Install PostgreSQL</li>
                                <li>Create database and run schema</li>
                                <li>Start API server: cd /home/saas/home-service-saas/apps/api && pnpm dev</li>
                            </ol>
                            <p className="mt-2">
                                See <code>QUICK-START-GUIDE.md</code> for detailed instructions.
                            </p>
                        </div>
                    )}
                </div>

                <button
                    onClick={checkStatus}
                    className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
                >
                    Recheck Status
                </button>
            </div>
        </div>
    );
}
