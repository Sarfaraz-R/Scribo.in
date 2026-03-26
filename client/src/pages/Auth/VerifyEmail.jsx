import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { verifyEmailByToken } from '../../api/auth.api';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, success: false, message: '' });

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await verifyEmailByToken(token);
        setState({
          loading: false,
          success: true,
          message: res?.message || 'Email verified. You can now sign in.',
        });
      } catch (error) {
        setState({
          loading: false,
          success: false,
          message:
            error?.response?.data?.message ||
            'Verification link is invalid or expired.',
        });
      }
    };

    if (token) verify();
    else {
      setState({ loading: false, success: false, message: 'Missing verification token.' });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Email Verification</h1>
        <p className="mt-3 text-sm text-slate-700">
          {state.loading ? 'Verifying your email...' : state.message}
        </p>
        {!state.loading && (
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => navigate('/auth/signin')}
              className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            >
              Go to Sign In
            </button>
            {state.success && (
              <Link
                to="/pending-approval"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
              >
                View Approval Status
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
