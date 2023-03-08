import express from 'express';
import graphManager from '../managers/graph.manager';

const sinkKinds: string[] = ["sqs", "rds"];
const router = express.Router();

router.get('/routes/sinks', async (req, res) => { 
    const paths = await graphManager.getAllRoutesEndsInSinkOfKind(sinkKinds);
    res.json(paths);
});

router.get('/routes/sinks/:sinkKind', async (req, res) => {
    const {sinkKind} = req.params;
    const paths = await graphManager.getAllRoutesEndsInSinkOfKind([sinkKind]);
    res.json(paths);
});

router.get('/routes/vulnerabilities', async (req, res) => {
    const paths = await graphManager.getAllVulnerabilitiesNodesNames();
    res.json(paths);
});

router.get('/routes/publicServiceToSink', async (req, res) => {
    const paths = await graphManager.getAllPathsFromPublicExposedToSink(false, sinkKinds);
    res.json(paths);
});

router.get('/routes/publicServiceToSink/:isPublic/:sinkKind', async (req, res) => {
    const isPublic = JSON.parse(req.params.isPublic);
    const {sinkKind} = req.params;
    const paths = await graphManager.getAllPathsFromPublicExposedToSink(isPublic, [sinkKind]);
    res.json(paths);
});

export default router;
