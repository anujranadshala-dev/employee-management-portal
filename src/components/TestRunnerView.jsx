/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, Terminal, RefreshCw, Layers, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export default function TestRunnerView() {
  const [isRunning, setIsRunning] = useState(false);
  const [filterSuite, setFilterSuite] = useState('all');
  const [tests, setTests] = useState([
    {
      id: 'T1',
      suite: 'validation',
      name: 'validateEmail() - rejects invalid email structures',
      status: 'idle',
      assertion: "expect(validateEmail('not-an-email')).toBe(false)",
    },
    {
      id: 'T2',
      suite: 'validation',
      name: 'validateEmail() - accepts standard corporate emails',
      status: 'idle',
      assertion: "expect(validateEmail('dwight.schrute@enterprise.com')).toBe(true)",
    },
    {
      id: 'T3',
      suite: 'validation',
      name: 'validateRequired() - flags empty fields as errors',
      status: 'idle',
      assertion: "expect(validateRequired('')).toBe(false)",
    },
    {
      id: 'T4',
      suite: 'auth',
      name: 'checkRolePermission() - Admin receives full CRUD permissions',
      status: 'idle',
      assertion: "expect(checkPermission('Admin', 'DELETE_EMPLOYEE')).toBe(true)",
    },
    {
      id: 'T5',
      suite: 'auth',
      name: 'checkRolePermission() - Employee cannot delete records',
      status: 'idle',
      assertion: "expect(checkPermission('Employee', 'DELETE_EMPLOYEE')).toBe(false)",
    },
    {
      id: 'T6',
      suite: 'auth',
      name: 'checkRolePermission() - Manager can edit department profiles',
      status: 'idle',
      assertion: "expect(checkPermission('Manager', 'EDIT_EMPLOYEE')).toBe(true)",
    },
    {
      id: 'T7',
      suite: 'metrics',
      name: 'calculateAvgSalary() - accurately handles average compensation arithmetic',
      status: 'idle',
      assertion: "expect(calculateAvgSalary([{ salary: 100000 }, { salary: 50000 }])).toBe(75000)",
    },
    {
      id: 'T8',
      suite: 'metrics',
      name: 'calculatePerformanceRatio() - ignores inactive employees from rating math',
      status: 'idle',
      assertion: "expect(calculatePerformanceRatio([{ score: 5, status: 'Active' }, { score: 1, status: 'Terminated' }])).toBe(5)",
    }
  ]);

  const runTestSuite = async () => {
    setIsRunning(true);
    
    // Reset status to running
    setTests(prev => prev.map(t => ({ ...t, status: 'running', duration: undefined })));

    // Run tests with a sequential delay to simulate a real terminal run
    for (let i = 0; i < tests.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 250));
      setTests(prev => {
        const copy = [...prev];
        const isSuccessful = Math.random() > 0.05; // 95% pass rate
        copy[i] = {
          ...copy[i],
          status: isSuccessful ? 'passed' : 'failed',
          duration: Math.floor(2 + Math.random() * 8),
          error: isSuccessful ? undefined : 'AssertionError: expected false to be true'
        };
        return copy;
      });
    }
    setIsRunning(false);
  };

  const filteredTests = tests.filter(t => filterSuite === 'all' || t.suite === filterSuite);
  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;

  return (
    <div className="space-y-6" id="vitest-root">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="h-5 w-5 text-indigo-500" />
            Automated Vitest Suite
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Validate enterprise validation forms, client-side route guards, and statistical telemetry models.
          </p>
        </div>

        <button
          onClick={runTestSuite}
          disabled={isRunning}
          id="btn-run-tests"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm disabled:opacity-50 cursor-pointer"
        >
          {isRunning ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? 'Running Assertions...' : 'Run Vitest Suite'}
        </button>
      </div>

      {/* Grid of details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sidebar categories */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-xs tracking-tighter uppercase">Test Suites</h3>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setFilterSuite('all')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSuite === 'all'
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-slate-400" /> All Unit Tests
                </span>
                <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono">
                  {tests.length}
                </span>
              </button>

              <button
                onClick={() => setFilterSuite('validation')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSuite === 'validation'
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Form Validation
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-mono">
                  3
                </span>
              </button>

              <button
                onClick={() => setFilterSuite('auth')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSuite === 'auth'
                    ? 'bg-indigo-50 text-indigo-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-500" /> Auth & Route Guards
                </span>
                <span className="bg-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded font-mono">
                  3
                </span>
              </button>

              <button
                onClick={() => setFilterSuite('metrics')}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  filterSuite === 'metrics'
                    ? 'bg-amber-50 text-amber-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-amber-500" /> Payroll & Metrics
                </span>
                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-mono">
                  2
                </span>
              </button>
            </div>
          </div>

          {/* Test run statistics summary */}
          <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-sm space-y-3">
            <h4 className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Vitest Console Output</h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="text-slate-400">Environment:</span>
                <span className="text-emerald-400">node / jsdom</span>
              </div>
              <div className="flex justify-between">
                <span>Total Assertions:</span>
                <span className="text-white">{tests.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Passed:</span>
                <span className="text-emerald-400">{passedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Failed:</span>
                <span className="text-rose-400">{failedCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={isRunning ? 'text-amber-400 animate-pulse' : 'text-slate-400'}>
                  {isRunning ? 'RUNNING' : passedCount === tests.length ? 'ALL PASSED' : 'READY'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Live assertion reporter */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-tighter">Targeted Assertions ({filteredTests.length})</h3>
              <span className="text-[10px] text-slate-400 font-mono">Vitest v2.1.2</span>
            </div>

            <div className="space-y-3.5">
              {filteredTests.map((t) => (
                <div key={t.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-700 capitalize">
                          {t.suite}
                        </span>
                        <h4 className="font-bold text-slate-850 text-xs">
                          {t.name}
                        </h4>
                      </div>
                      <p className="font-mono text-[11px] text-slate-500 bg-slate-100/50 p-2 rounded-lg border border-slate-200 mt-1">
                        {t.assertion}
                      </p>
                      {t.error && (
                        <p className="font-mono text-xs text-rose-600 bg-rose-50 border border-rose-100 p-2 rounded-md mt-1.5">
                          {t.error}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
                      {t.status === 'idle' && (
                        <span className="h-2 w-2 rounded-full bg-slate-300" />
                      )}
                      {t.status === 'running' && (
                        <RefreshCw className="h-4 w-4 text-amber-500 animate-spin" />
                      )}
                      {t.status === 'passed' && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 font-mono">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                          pass {t.duration}ms
                        </span>
                      )}
                      {t.status === 'failed' && (
                        <span className="flex items-center gap-1 text-xs font-medium text-rose-600 font-mono">
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                          fail
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
