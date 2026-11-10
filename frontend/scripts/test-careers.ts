import assert from 'assert';

const BASE_URL = 'http://localhost:3000';

async function runCareersTests() {
  console.log('🚀 Starting NexusHub Careers Marketplace Automated Test Suite...\n');

  // Test 1: Public Careers Search & Pagination
  console.log('--- Test 1: Public Careers Search, Filtering & Pagination ---');
  const searchRes = await fetch(`${BASE_URL}/api/careers?page=1&limit=3`);
  assert.strictEqual(searchRes.status, 200, 'Public careers search should return 200');
  const searchData = await searchRes.json();
  assert(Array.isArray(searchData.items), 'Search results must include items array');
  assert(searchData.pagination, 'Search results must include pagination');
  assert.strictEqual(searchData.pagination.page, 1, 'Page should be 1');
  assert.strictEqual(searchData.pagination.limit, 3, 'Limit should be 3');
  assert(searchData.items.length <= 3, 'Items returned should not exceed limit');
  console.log(`✅ Loaded ${searchData.items.length} items from total ${searchData.pagination.total} opportunities (Page 1 of ${searchData.pagination.totalPages})`);

  // Test 2: Specific Filtering by Role / Domain
  console.log('\n--- Test 2: Filter by Technical Role Domain (AI / Machine Learning) ---');
  const filterRes = await fetch(`${BASE_URL}/api/careers?role=AI+%2F+Machine+Learning`);
  assert.strictEqual(filterRes.status, 200);
  const filterData = await filterRes.json();
  assert(filterData.items.length > 0, 'Should find at least one AI role');
  for (const item of filterData.items) {
    assert(item.role.toLowerCase().includes('ai'), 'Every item must match the AI domain');
  }
  console.log(`✅ Role domain filter verified: found ${filterData.items.length} AI / Machine Learning roles`);

  // Test 3: Specific Opportunity Detail
  console.log('\n--- Test 3: Detailed Opportunity Lookup ---');
  const sampleCareer = searchData.items[0];
  const detailRes = await fetch(`${BASE_URL}/api/careers/${sampleCareer.id}`);
  assert.strictEqual(detailRes.status, 200);
  const detailData = await detailRes.json();
  assert.strictEqual(detailData.career.id, sampleCareer.id);
  assert(detailData.career.title, 'Opportunity must have a title');
  assert(detailData.career.organization, 'Opportunity must have an organization');
  assert(Array.isArray(detailData.career.skills), 'Opportunity must have skills array');
  console.log(`✅ Detail fetch verified for "${detailData.career.title}" at ${detailData.career.organization}`);

  // Test 4: Authentication & Role-Based Permissions
  console.log('\n--- Test 4: Role-Based Permissions for Opportunity Posting ---');
  const timestamp = Date.now();
  const studentEmail = `student_${timestamp}@nexuscareer.test`;
  const recruiterEmail = `recruiter_${timestamp}@nexuscareer.test`;
  const password = 'StrongPassword!123';

  // Register Student
  const studentSignupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Sarah Student',
      email: studentEmail,
      password,
      role: 'student'
    })
  });
  assert(studentSignupRes.status === 200 || studentSignupRes.status === 201);
  const studentCookie = studentSignupRes.headers.get('set-cookie');
  assert(studentCookie, 'Student cookie must exist');
  console.log('✅ Student account registered');

  // Register Recruiter / Founder
  const recruiterSignupRes = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Raymond Recruiter',
      email: recruiterEmail,
      password,
      role: 'founder'
    })
  });
  assert(recruiterSignupRes.status === 200 || recruiterSignupRes.status === 201);
  const recruiterCookie = recruiterSignupRes.headers.get('set-cookie');
  assert(recruiterCookie, 'Recruiter cookie must exist');
  console.log('✅ Recruiter account registered (role: founder)');

  // Attempt to post as Student -> MUST BE FORBIDDEN (403)
  console.log('\n--- Test 5: Verify Student CANNOT post an opportunity (403 Forbidden) ---');
  const studentPostRes = await fetch(`${BASE_URL}/api/careers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: studentCookie
    },
    body: JSON.stringify({
      title: 'Illegal Student Job Posting',
      organization: 'Fake Org',
      description: 'This posting should be rejected by server RBAC.',
      deadline: '2026-12-31',
      skills: ['None']
    })
  });
  assert.strictEqual(studentPostRes.status, 403, 'Student posting must be blocked with 403 Forbidden');
  console.log('✅ Student posting correctly blocked with 403 Forbidden');

  // Recruiter posts an opportunity -> MUST SUCCEED (201)
  console.log('\n--- Test 6: Verify Recruiter CAN post a new opportunity (201 Created) ---');
  const recruiterPostRes = await fetch(`${BASE_URL}/api/careers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: recruiterCookie
    },
    body: JSON.stringify({
      title: 'Nexus Edge Compiler Lead Engineer',
      organization: 'Consensus Core Lab',
      department: 'Low-Level Systems',
      category: 'job',
      role: 'Software Engineering',
      employmentType: 'full-time',
      experienceLevel: 'lead',
      location: 'Boston, MA / Remote',
      isRemote: true,
      salaryRange: '$175,000 - $210,000 / yr',
      deadline: '2026-12-31',
      description: 'Building zero-overhead WebAssembly runtime and JIT optimization passes for distributed edge nodes.',
      responsibilities: ['Architect optimizing bytecode compiler', 'Benchmark CPU instruction throughput'],
      requirements: ['Rust or C++ proficiency', 'Experience with compiler intrinsics'],
      benefits: ['Substantial founder equity grant', 'Comprehensive medical & dental'],
      skills: ['Rust', 'WebAssembly', 'LLVM', 'Compilers'],
      targetRoles: ['professional', 'founder'],
      featured: true
    })
  });
  assert.strictEqual(recruiterPostRes.status, 201, 'Recruiter opportunity creation should return 201');
  const createdCareerData = await recruiterPostRes.json();
  const newCareerId = createdCareerData.career.id;
  assert(newCareerId, 'Created career must have an ID');
  console.log(`✅ Recruiter created job: "${createdCareerData.career.title}" (ID: ${newCareerId})`);

  // Test 7: Save & Bookmark Opportunity
  console.log('\n--- Test 7: Save / Bookmark Opportunity ---');
  const saveRes = await fetch(`${BASE_URL}/api/careers/${newCareerId}/save`, {
    method: 'POST',
    headers: { Cookie: studentCookie }
  });
  assert.strictEqual(saveRes.status, 200);
  const saveData = await saveRes.json();
  assert.strictEqual(saveData.saved, true, 'Opportunity should now be saved');
  console.log('✅ Student bookmarked opportunity');

  // Check saved list
  const savedListRes = await fetch(`${BASE_URL}/api/careers/saved`, {
    headers: { Cookie: studentCookie }
  });
  const savedListData = await savedListRes.json();
  assert(savedListData.savedIds.includes(newCareerId), 'Saved IDs must include new opportunity');
  console.log('✅ Verified opportunity appears in student saved list');

  // Test 8: Submit Application
  console.log('\n--- Test 8: Student Submits Job Application ---');
  const applyRes = await fetch(`${BASE_URL}/api/careers/${newCareerId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: studentCookie
    },
    body: JSON.stringify({
      coverLetter: 'I have deep experience with Rust, memory layout optimization, and WASM JIT compilation engines from my open-source project.',
      portfolioUrl: 'https://github.com/sarah-student',
      yearsOfExperience: '1-2 years',
      skills: ['Rust', 'WebAssembly', 'Compilers']
    })
  });
  assert.strictEqual(applyRes.status, 201, 'Application submission should return 201');
  const applyData = await applyRes.json();
  const applicationId = applyData.application.id;
  assert(applicationId, 'Created application must have an ID');
  assert.strictEqual(applyData.application.status, 'submitted');
  console.log(`✅ Application submitted successfully (ID: ${applicationId})`);

  // Test 9: Duplicate Application Prevention (CRITICAL)
  console.log('\n--- Test 9: Duplicate Application Prevention ---');
  const duplicateApplyRes = await fetch(`${BASE_URL}/api/careers/${newCareerId}/apply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: studentCookie
    },
    body: JSON.stringify({
      coverLetter: 'Attempting duplicate submission to test security boundary.',
      portfolioUrl: 'https://github.com/sarah-student'
    })
  });
  assert(
    duplicateApplyRes.status === 409 || duplicateApplyRes.status === 400,
    'Duplicate application must be rejected with 409 or 400'
  );
  const duplicateData = await duplicateApplyRes.json();
  console.log(`✅ Duplicate submission prevented with code ${duplicateApplyRes.status}: "${duplicateData.error}"`);

  // Test 10: Applicant Information Protection (Privacy check)
  console.log('\n--- Test 10: Applicant Privacy Protection ---');
  // Student attempts to view applicant list for the job -> MUST BE FORBIDDEN (403)
  const studentViewApplicantsRes = await fetch(`${BASE_URL}/api/careers/${newCareerId}/applicants`, {
    headers: { Cookie: studentCookie }
  });
  assert(
    studentViewApplicantsRes.status === 403 || studentViewApplicantsRes.status === 401,
    'Unauthorized users must NOT see applicant lists'
  );
  console.log('✅ Candidate privacy verified: student cannot view applicant data (403)');

  // Recruiter who posted the job views applicant list -> MUST SUCCEED (200)
  const recruiterViewApplicantsRes = await fetch(`${BASE_URL}/api/careers/${newCareerId}/applicants`, {
    headers: { Cookie: recruiterCookie }
  });
  assert.strictEqual(recruiterViewApplicantsRes.status, 200, 'Recruiter must be able to view applicants for their job');
  const recruiterApplicantsData = await recruiterViewApplicantsRes.json();
  assert(Array.isArray(recruiterApplicantsData.applicants), 'Must return array of applicants');
  assert(recruiterApplicantsData.applicants.length >= 1, 'Should find candidate application');
  const foundApplicant = recruiterApplicantsData.applicants.find((a: any) => a.id === applicationId);
  assert(foundApplicant, 'Submitted application must be present');
  console.log(`✅ Recruiter viewed applicant: "${foundApplicant.applicantName}" (${foundApplicant.applicantEmail})`);

  // Test 11: Recruiter Updates Candidate Status
  console.log('\n--- Test 11: Recruiter Updates Candidate Status to "interviewing" ---');
  const updateStatusRes = await fetch(`${BASE_URL}/api/careers/${newCareerId}/applicants`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Cookie: recruiterCookie
    },
    body: JSON.stringify({
      applicationId,
      status: 'interviewing',
      notes: 'Impressive compiler projects on GitHub. Invited to round 1 technical interview.'
    })
  });
  assert.strictEqual(updateStatusRes.status, 200, 'Status update should return 200');
  console.log('✅ Candidate status updated to "interviewing"');

  // Test 12: Candidate Application Tracker
  console.log('\n--- Test 12: Candidate Tracker Reflects Status Update ---');
  const trackerRes = await fetch(`${BASE_URL}/api/careers/applications`, {
    headers: { Cookie: studentCookie }
  });
  assert.strictEqual(trackerRes.status, 200);
  const trackerData = await trackerRes.json();
  const updatedStudentApp = trackerData.applications.find((a: any) => a.id === applicationId);
  assert(updatedStudentApp, 'Student application must be in tracker');
  assert.strictEqual(updatedStudentApp.status, 'interviewing', 'Candidate status should now be interviewing');
  assert(updatedStudentApp.reviewerNotes?.includes('Round 1') || updatedStudentApp.reviewerNotes?.includes('interview'));
  console.log(`✅ Candidate tracker verified: status is "${updatedStudentApp.status}", reviewer note received: "${updatedStudentApp.reviewerNotes}"`);

  console.log('\n🎉 ALL 12 CAREERS MODULE TESTS PASSED WITH 100% SUCCESS!');
}

runCareersTests().catch((err) => {
  console.error('\n❌ Test suite failed:', err);
  process.exit(1);
});
