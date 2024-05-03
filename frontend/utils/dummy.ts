import { dummyData } from './dummyData';

interface AdditionalInformation {
	overviewUri: string;
	termsUri: string;
	eligibilityUri: string;
	pricingUri: string;
	bundleUri: string;
}

interface Geography {
	excludedPostcodes: string[];
	includedPostcodes: string[];
	distributors: string[];
}

interface Plan {
	planId: string;
	effectiveFrom: string;
	effectiveTo: string;
	lastUpdated: string;
	displayName: string;
	description: string;
	type: string;
	fuelType: string;
	brand: string;
	brandName: string;
	applicationUri: string;
	additionalInformation: AdditionalInformation;
	customerType: string;
	geography: Geography;
}

interface Data {
	plans: Plan[];
}

interface DummyData {
	data: Data;
	links: {
		self: string;
		first: string;
		prev: string;
		next: string;
		last: string;
	};
	meta: {
		totalRecords: number;
		totalPages: number;
	};
}

const returnDummyData = (): DummyData => {
	return dummyData;
};

const getVictorianPlanIds = (): string[] => {
	const data = returnDummyData();
	const plans = data.data.plans;
	const victorianPlans = plans.filter((plan) =>
		plan.geography.includedPostcodes.some((postcode) =>
			postcode.startsWith('3')
		)
	);
	const planIdSet = new Set<string>(
		victorianPlans.map((plan) => plan.planId)
	);
	return Array.from(planIdSet);
};

const countPlans = (): number => {
	const data = returnDummyData();
	return data.data.plans.length;
};

const getResidentialPlans = (): Plan[] => {
	const data = returnDummyData();
	return data.data.plans.filter(
		(plan) => plan.customerType === 'RESIDENTIAL'
	);
};

const getUniqueResidentialDisplayNames = (): string[] => {
	const data = returnDummyData();
	const residentialPlans = data.data.plans.filter(
		(plan) => plan.customerType === 'RESIDENTIAL'
	);
	const displayNameSet = new Set<string>(
		residentialPlans.map((plan) => plan.displayName)
	);
	return Array.from(displayNameSet);
};

export {
	getVictorianPlanIds,
	returnDummyData,
	countPlans,
	getResidentialPlans,
	getUniqueResidentialDisplayNames
};
