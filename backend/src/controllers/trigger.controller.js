const Trigger = require('../models/trigger.model');
const logger = require('../config/logger');

exports.createTrigger = async (req, res) => {
    try {
        logger.info('Creating new trigger', {
            contractId: req.body.contractId,
            eventName: req.body.eventName,
            userAgent: req.get('User-Agent'),
            ip: req.ip
        });
        
        const trigger = new Trigger(req.body);
        await trigger.save();
        
        logger.info('Trigger created successfully', {
            triggerId: trigger._id,
            contractId: trigger.contractId,
            eventName: trigger.eventName,
            isActive: trigger.isActive
        });
        
        res.status(201).json(trigger);
    } catch (error) {
        logger.error('Failed to create trigger', {
            error: error.message,
            stack: error.stack,
            requestBody: req.body,
            ip: req.ip
        });
        res.status(400).json({ error: error.message });
    }
};

exports.getTriggers = async (req, res) => {
    try {
        logger.debug('Fetching all triggers', { ip: req.ip });
        
        const triggers = await Trigger.find();
        
        logger.info('Triggers fetched successfully', {
            count: triggers.length,
            ip: req.ip
        });
        
        res.json(triggers);
    } catch (error) {
        logger.error('Failed to fetch triggers', {
            error: error.message,
            stack: error.stack,
            ip: req.ip
        });
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTrigger = async (req, res) => {
    try {
        const triggerId = req.params.id;
        
        logger.info('Deleting trigger', {
            triggerId: triggerId,
            ip: req.ip
        });
        
        const deletedTrigger = await Trigger.findByIdAndDelete(triggerId);
        
        if (!deletedTrigger) {
            logger.warn('Trigger not found for deletion', {
                triggerId: triggerId,
                ip: req.ip
            });
            return res.status(404).json({ error: 'Trigger not found' });
        }
        
        logger.info('Trigger deleted successfully', {
            triggerId: triggerId,
            contractId: deletedTrigger.contractId,
            eventName: deletedTrigger.eventName,
            ip: req.ip
        });
        
        res.status(204).send();
    } catch (error) {
        logger.error('Failed to delete trigger', {
            error: error.message,
            stack: error.stack,
            triggerId: req.params.id,
            ip: req.ip
        });
        res.status(500).json({ error: error.message });
    }
};
