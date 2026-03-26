import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

export default function PendingApprovalCard({ status }) {
  const rejected = String(status || '').toLowerCase() === 'rejected';

  return (
    <Card className="max-w-xl w-full">
      <CardHeader>
        <CardTitle>
          {rejected ? 'Registration Not Approved' : 'Your Account Is Under Verification'}
        </CardTitle>
        <CardDescription>
          {rejected
            ? 'Please contact your institution administrator for details.'
            : 'Our administrators are reviewing your registration request.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {rejected ? (
          <>
            <p className="text-sm text-slate-700">
              Your registration request was not approved.
            </p>
            <p className="text-sm text-slate-700">
              Please contact the administrator.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-700">Your account is under verification.</p>
            <p className="text-sm text-slate-700">
              This usually takes up to 24 hours.
            </p>
            <p className="text-sm text-slate-700">
              You will gain access once your account is approved.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
